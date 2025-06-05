import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { GeneracionService } from '../generacion.service';

@Component({
standalone: false,
  selector: 'app-modal-impuestos',
  templateUrl: './modal-impuestos.component.html',
  styleUrls: ['./modal-impuestos.component.scss']
})
export class ModalImpuestosComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() id_concepto: number;
  @Input() codigo: string;
  @Input() conceptosBackup: any = [];
  @Input() conceptos: any = [];
  @Input() fTitle: string = "";
  @Input() ordenActive: any;
  resdata: any = [];
  vmButtons: any;

  filter: any;
  paginate: any;

  primeraCarga: boolean = true;

  constructor(
    private apiService: GeneracionService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnModalImpuestos", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalImpuestos", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
      this.cargarConceptos();
    }, 50);

  }

  cargarConceptos() {
    let data: any = {
      // Listado de Impuestos
      orden_inspeccion: { numero: this.ordenActive.numero_orden },
      impuestos: ['PESAYMEDIDA', 'INTRODUCTOR', 'LOCALES TURISTICOS', 'PATENTE', 'VIA PUBLICA', '1,5', 'LETREROS']
    }

    (this as any).mensajeSpinner = "Obteniendo valores"
    this.lcargando.ctlSpinner(true);
    this.apiService.getValoresPorCobrar(data).subscribe(
      (res: any) => {
        // console.log(res.data)
        // console.log(this.conceptosBackup);
        this.resdata = [];
        res.data.forEach((elem: any) => {
          if (elem.codigo_detalle == 'PESAYMEDIDA') {
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == 'INTRODUCTOR') {
            let array =JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            array[0].observacion = elem.observacion;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == 'LOCALES TURISTICOS') {
            console.log(elem, this.conceptosBackup)
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == 'PATENTE') {
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == 'VIA PUBLICA') {
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            array[0].observacion = elem.observacion;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == '1,5') {
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          } else if (elem.codigo_detalle == 'LETREROS') {
            let array = JSON.parse(JSON.stringify( this.conceptosBackup.filter(c => c.codigo_detalle == elem.codigo_detalle)));
            array[0].valor = elem.total;
            array[0].id = elem.id_inspeccion_orden_cobrar;
            array[0].observacion = elem.observacion;
            if(this.conceptos.find(c => c.id == elem.id_inspeccion_orden_cobrar)){
              array[0].aplica = true;
            } else {
              array[0].aplica = false;
            }
            this.resdata.push(array[0]);
          }
        });

        // this.resdata.forEach(r => {
        //   // this.conceptos.forEach(c => {
        //   //   if (c.id == r.id){
        //   //     r.aplica = true;
        //   //   } else {
        //   //     r.aplica = false;
        //   //   }
        //   // })
        //   r.aplica = false;
        // })
        // this.resdata.forEach(r => {
        //   this.conceptos.forEach(c => {
        //     if (c.id == r.id){
        //       r.aplica = true;
        //     } else {
        //       r.aplica = false;
        //     }
        //   })
        //   // r.aplica = false;
        // })
        // console.log(this.conceptos);
        // this.calcSubtotal()
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error('Hubo un problema obteniendo valores de impuestos', this.fTitle)
      }
    )
  }

  
  aplica(dt, i){
    let aplica = dt.aplica;
    // console.log(dt);
    if(aplica){
      dt.cantidad = 1;
      dt.total = dt.valor;
      dt.id = dt.id;
      if(dt.observacion){
        dt.comentario = dt.observacion + "";
      }

      this.conceptos.push(dt);
    }else {
      // let id = this.conceptos.indexOf(dt);
      // this.conceptos.splice(i,1);
      this.conceptos.forEach(c => {
        if(dt.id==c.id){
          // console.log(c);
          let ind = this.conceptos.indexOf(c);
          this.conceptos.splice(ind,1);
        }
      })
    }
  }

  // CAMBIAR SI ES NECESARIO
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
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

  selectImpuesto(impuesto: any) {
    Object.assign(impuesto, { cantidad: 1, total: impuesto.valor, comentario: (impuesto.observacion) ? impuesto.observacion : '', aplica: true })
    this.commonVarService.selectConceptoCustom.next([impuesto])
    this.activeModal.close()
  }

}
