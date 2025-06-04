import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { OrdenService } from '../orden.service';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-modal-solicitud-cat',
  templateUrl: './modal-solicitud-cat.component.html',
  styleUrls: ['./modal-solicitud-cat.component.scss']
})
export class ModalSolicitudCatComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() proveedor: any;
  @Input() tipo_proceso: any;

  solicitud:any = []

  vmButtons: any = []

  filter: any;
  paginate: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  estadoSelected = 0

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicioSolicitud: OrdenService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      num_solicitud: undefined,
      estado: "",
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarSolicitudes();
    },500)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
    }
  }


  cargarSolicitudes(){
    this.mensajeSpinner = "Cargando lista de Solicitud...";
    this.lcargando.ctlSpinner(true);
    console.log(this.tipo_proceso)
    let data={
      tipo_proceso: this.tipo_proceso,
      id: this.proveedor.id_proveedor,
      params:{
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
  //  this.servicioSolicitud.getSolicitudModalCat(data).subscribe(
    this.servicioSolicitud.getSolicitudModalCatIngreso(data).subscribe(

      (res)=>{
         console.log(res);
         this.paginate.length = res['data']['total']
         this.solicitud = res['data']['data']
        //  res['data']['data'].forEach(soli => {
        //     soli.ordenes.forEach(orden => {
        //       let data= {
        //         id_ordenes:orden.id_ordenes,
        //         fecha_creacion: soli.fecha_creacion,
        //         descripcion: soli.descripcion,
        //         num_solicitud:soli.num_solicitud,
        //         ce_proceso:soli.ce_proceso,
        //         tipo_proceso:soli.tipo_proceso,
        //         num_orden: orden.num_orden,
        //         valor: soli.valor,
        //         valor_orden: orden.valor,
        //         idp: soli.idp,
        //         estado: soli.estado,
        //         estado_orden: orden.estado,
        //       }
        //       this.solicitud.push(data)
        //   });
        //  });
        // this.solicitud = res['data']['data']
        // if(res['data']['current_page'] === 1){
        //   this.solicitud = res['data']['data'];
        // }else{
        //   this.solicitud = Object.values(res['data']['data'])
        // }

        this.lcargando.ctlSpinner(false);

      }
    )

  }



  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarSolicitudes();
  }


  selectOption(data) {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea seleccionar esta solicitud?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonVrs.seleciconSolicitud.next(data)
        this.activeModal.close()
      }
    });

  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_solicitud: undefined,
      estado:"",
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    }
    this.estadoSelected = 0
  }

}
