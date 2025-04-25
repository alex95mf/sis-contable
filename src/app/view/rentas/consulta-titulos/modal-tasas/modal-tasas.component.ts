import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConsultaTitulosService } from '../consulta-titulos.service'; 

@Component({
  selector: 'app-modal-tasas',
  templateUrl: './modal-tasas.component.html',
  styleUrls: ['./modal-tasas.component.scss']
})
export class ModalTasasComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() id_concepto: number;
  @Input() codigo: string;
  @Input() conceptos: any = [];
  //@Input() tasas: any = [];
  @Input() fTitle: string = "";
  @Input() valor_unitario: boolean = false;
  resdata: any = [];
  
  vmButtons: any;

  filter: any;
  paginate: any;

  constructor(
    private apiService: ConsultaTitulosService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
  ) { }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.commonVarService.updPerm.next(true);
    //   this.cargarTasasVarias();
    // }, 50);

    this.vmButtons = [
     // { orig: "btnsTasasVarias", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsTasasVarias", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.filter = {
      codigo: undefined,
      descripcion: undefined,
      estado: ['A', 'I'],
      motivacion_legal:undefined,
      tipo_calculo:0,
      tipo_tabla:0,
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(()=> {
      this.cargarTasasVarias(true)
    }, 0);

  }

  cargarTasasVarias(inicial?: boolean) {
    this.mensajeSpinner = "Cargando listado de tasas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: inicial ? undefined : this.filter,
        paginate: this.paginate
      }
    }
    
    this.apiService.getTasasVarias(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            this.conceptos.forEach(c => {
              if (e.codigo==c.codigo){
                Object.assign(e , {
                  aplica: true,
                  valor: e.valor,
                  comentario: "",
                  cantidad: 0,
                  total: 0,
                })
              }
            })
          })
          this.resdata = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any) => {
            this.conceptos.forEach(c => {
              if (e.codigo==c.codigo){
                Object.assign(e , {
                  aplica: true,
                  valor: e.valor,
                  comentario: "",
                  cantidad: 0,
                  total: 0,
                })
              }
            })
          })
          this.resdata = array;
        }
        
        this.lcargando.ctlSpinner(false);
       
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTasasVarias();
  }

  limpiarFiltros() {
    this.filter = {
      codigo: undefined,
      descripcion: undefined,
      estado: ['A', 'I'],
      motivacion_legal:undefined,
      tipo_calculo:0,
      tipo_tabla:0,
      filterControl: "",
    }
  }

  fillBorradoManual() {
   
    if( this.filter.codigo == "") {
      this.filter.codigo = undefined;
     
    }else if(this.filter.descripcion == ""){
      this.filter.descripcion = undefined;
    }else if (this.filter.motivacion_legal == ""){
      this.filter.motivacion_legal = undefined;
    }
    this.cargarTasasVarias(false)
  }

  // aplica(dt){
  //   let aplica = dt.aplica;
  //   // console.log(dt);
  //   if(aplica){
  //     dt.cantidad = 1;
  //     dt.total = dt.valor;
  //     this.conceptos.push(dt);
  //   }else {
  //     // let id = this.conceptos.indexOf(dt);
  //     // this.conceptos.splice(i,1);
  //     this.conceptos.forEach(c => {
  //       if(dt.id_concepto_detalle==c.id_concepto_detalle){
  //         // console.log(c);
  //         let id = this.conceptos.indexOf(c);
  //         this.conceptos.splice(id,1);
  //       }
  //     })
  //   }
  // }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      // case " APLICAR":
      //   this.closeModal(this.conceptos);
      //   break;
    }
  }
  selectOption(data) {
   
      this.closeModal(data);
    
  }

  closeModal(data?:any) {
    if(data){
      //this.commonVarService.selectConceptoCustom.next(data);
      this.apiService.listaTasas$.emit(data)

    }
    this.activeModal.dismiss();
  }

  

}
