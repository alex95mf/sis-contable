import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { ModalConceptosService } from './modal-conceptos.service';
import { CommonVarService } from 'src/app/services/common-var.services';
// import { MultasService } from '../multas.service';


@Component({
standalone: false,
  selector: 'app-modal-conceptos',
  templateUrl: './modal-conceptos.component.html',
  styleUrls: ['./modal-conceptos.component.scss']
})
export class ModalConceptosComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() id_concepto: number;
  @Input() codigo: string;
  @Input() conceptos: any = [];
  @Input() fTitle: string = "";
  @Input() valor_unitario: boolean = false;
  resdata: any = [];
  
  vmButtons: any;

  filter: any;
  paginate: any;

  constructor(
    private apiService: ModalConceptosService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
      this.cargarConceptos();
    }, 50);

    this.vmButtons = [
      { orig: "btnModalConceptos", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalConceptos", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.filter = {
      nombre_detalle: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    // this.paginate.length = this.conceptos.length;
    // this.switch = false;
    
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
  }

  aplicarFiltros() {
    // devuelve la pagina a 1 para que se vea la data filtrada
    let newPaginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConceptos();
  }

  cargarConceptos() {
    this.mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    // let data = {
    //   id_concepto: this.id_concepto,
    //   params: {
    //     filter: this.filter,
    //     paginate: this.paginate
    //   }
    // }
    let data = {
      codigo: this.codigo,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.apiService.getConceptoDetByCod(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            this.conceptos.forEach(c => {
              if (e.id_concepto_detalle==c.id_concepto_detalle){
                Object.assign(e , {
                  aplica: true,
                  valor: parseFloat(e.valor),
                  comentario: "",
                  cantidad: 0,
                  total: 0,
                  fk_concepto_detalle: e.id_concepto_detalle
                })
              }
            })
          })
          this.resdata = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any) => {
            this.conceptos.forEach(c => {
              
              if (e.id_concepto_detalle==c.id_concepto_detalle){
                Object.assign(e , {
                  aplica: true,
                  valor: e.valor,
                  comentario: "",
                  cantidad: 0,
                  total: 0,
                  fk_concepto_detalle: e.id_concepto_detalle
                })
              }
            })
          })
          this.resdata = array;
        }

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

  aplica(dt){
    let aplica = dt.aplica;
    // console.log(dt);
    if(aplica){
      dt.cantidad = 1;
      dt.total = dt.valor;
      this.conceptos.push(dt);
    }else {
      // let id = this.conceptos.indexOf(dt);
      // this.conceptos.splice(i,1);
      this.conceptos.forEach(c => {
        if(dt.id_concepto_detalle==c.id_concepto_detalle){
          // console.log(c);
          let id = this.conceptos.indexOf(c);
          this.conceptos.splice(id,1);
        }
      })
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal(this.conceptos);
        break;
      case " APLICAR":
        this.closeModal(this.conceptos);
        break;
    }
  }
  
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConceptos();
  }

  limpiarFiltros() {
    this.filter.nombre_detalle = undefined;
  }

  closeModal(data?:any) {
    if(data){
      this.commonVarService.selectConceptoCustom.next(data);

    }
    this.activeModal.dismiss();
  }

}
