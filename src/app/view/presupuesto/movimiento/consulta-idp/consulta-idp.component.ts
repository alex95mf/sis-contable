import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { environment } from 'src/environments/environment';

import { format } from 'date-fns';
import Swal from "sweetalert2/dist/sweetalert2.js";

import { ConsultaIdpService } from './consulta-idp.service';
import { ModalIdpdetallesComponent } from './modal-idpdetalles/modal-idpdetalles.component';
import { ModalEstadoComponent } from './modal-estado/modal-estado.component';

@Component({
  selector: 'app-consulta-idp',
  templateUrl: './consulta-idp.component.html',
  styleUrls: ['./consulta-idp.component.scss']
})
export class ConsultaIdpComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  // @Input() module_comp: any;
  // @Input() permissions: any;
  // @Input() verifyRestore: any;

  vmButtons: any;
  documentosDt: any = [];
  paginate: any = {
    length: 0,
    perPage: 20,
    page: 1,
    pageSizeOptions: [ 10,20,50]
  }
  filter: any = {
    estado: null,
    razon_social: null,
    num_documento: null,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    filterControl: ""
  }

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  estado: any = [
    {valor: 'E', descripcion: 'Emitido'},
    {valor: 'A', descripcion: 'Aprobado'},
    {valor: 'C', descripcion: 'Comprometido'},
    {valor: 'D', descripcion: 'Devengado'},
    {valor: 'P', descripcion: 'Pagado'},
    {valor: 'X', descripcion: 'Anulado'}
  ]



  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ConsultaIdpService,
    private modal: NgbModal
  ) {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsDocumentos",
        paramAction: "",
        boton: {icon: "far fa-file-pdf", texto: "PROCESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsDocumentos",
        paramAction: "",
        boton: {icon: "far fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsDocumentos",
        paramAction: "",
        boton: {icon: "far fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
      /*{
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }*/
    ]

    this.commonVrs.modalCambioEstaIDP.subscribe(
      (res)=>{
        this.cargarDocumentos();
      }
    )
  }

  ngOnInit(): void {
    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);
    
    setTimeout(()=> {
      this.cargarDocumentos();
    }, 50);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
          this.showExcel();
          break;
      case "PDF":
          this.showPDF();
          break;
      case "PROCESAR":
        this.procesarSp();
        break;
          
    }
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0});
    this.cargarDocumentos();
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarDocumentos();
  }

  cargarDocumentos(){
    this.mensajeSppiner = "Cargando documentos";
    this.lcargando.ctlSpinner(true);
    // if (flag) this.paginate.page = 1
    const data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
      codigo: "IDP"
    }

    this.apiSrv.getGeneracionIdp(data).subscribe(
      (res: any) => {
        console.log(res);
        // this.documentosDt = res['data'];
        this.paginate.length = res['data']['total'];

        res.data.data.map((item: any) => {
          Object.assign(item, { programas: [], devengado: item.total - item.saldo_devengado, pagado: item.total - item.saldo_pagado })
          item.solicitud?.detalles.map((detalle:any) => {
            if (item.programas.length === 0) {
              item.programas.push(detalle.catalogo_programa)
            } else {
              item.programas.map((programa: any) => {
                if (programa.id_catalogo != detalle.fk_programa) {
                  item.programas.push(detalle.catalogo_programa)
                }
              })
            }
          })
        })
        this.documentosDt = res['data']['data'];
        
        console.log(res['data']['data']);

        
        /* if (res['data']['current_page'] == 1) {
          

        } else {
          res['data']['data'].forEach(e => {
            Object.assign(e, {devengado: e.total - e.saldo_devengado, pagado: e.total - e.saldo_pagado})
          })
          this.documentosDt = Object.values(res['data']['data']);
          this.documentosDt.map(
            (e)=>{
              e['programas'] = []
              e['solicitud']['detalles'].map(
                (c)=>{
                  if(e['programas'].length === 0){
                    e['programas'].push(c['catalogo_programa']);
                  }else{
                    e['programas'].map(
                      (v)=>{
                        if(v['id_catalogo'] === c['fk_programa']){
                          e['programas'].push(c['catalogo_programa'])
                        }
                      }
                    )
                  }
                }
              )
            }
          )
          console.log(this.documentosDt);
        } */
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message, 'Error cargando Documentos');
      }
    );
  }

  procesarSp(){
    let message = ''

    if(this.filter.fecha_desde ==undefined  || this.filter.fecha_desde==''){
      // this.toastr.info('Debe seleccionar una Fecha de Inicio');
      message += '* Debe seleccionar una Fecha de Inicio.<br>'
    }
    else if(this.filter.fecha_hasta ==undefined  || this.filter.fecha_hasta==''){
      // this.toastr.info('Debe seleccionar una Fecha de Fin');
      message += '* Debe seleccionar una Fecha de Fin.<br>'
    }

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
    }
    // else{
  
      const data = {
        fecha_desde: moment(this.filter.fecha_desde).format('YYYYMMDD'),
        fecha_hasta: moment(this.filter.fecha_hasta).format('YYYYMMDD'),
      }
    
      this.mensajeSppiner = "Procesando...";
      this.lcargando.ctlSpinner(true);
      this.apiSrv.procesarSp(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se ha procesado con éxito",
          //text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
      })
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    // }
  }

  limpiarFiltros() {
    this.filter = {
      estado: null,
      razon_social: null,
      num_documento: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      filterControl: ""
    }
  }

  selectOption(data) {
    console.log(data['solicitud']);
    let moda = this.modal.open(ModalIdpdetallesComponent,{
      size:"xl",
      backdrop: "static",
      // windowClass: "viewer-content-general",
    })

    moda.componentInstance.solicitu = data['solicitud']
  }

  modalEstado(data){
    let mod = this.modal.open(ModalEstadoComponent,{
      size:"xl",
      backdrop: "static",
      // windowClass: "viewer-content-general",
    });

    mod.componentInstance.id = data['id_documento'];
    mod.componentInstance.estad = data['estado'];
    mod.componentInstance.observ = data['observacion_cambio'];
  }

  showPDF(){
    console.log(this.filter.estado)
    let estado_reporte=''
    if(this.filter.estado==undefined || this.filter.estado== '' || this.filter.estado== 0){
      estado_reporte= 'T';
    }else{
      estado_reporte= this.filter.estado
    }
    console.log(estado_reporte)
    console.log(environment.ReportingUrl +"rpt_pre_detalle_idp.pdf?&j_username="  + environment.UserReporting  + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde+"&fechaFin=" + this.filter.fecha_hasta+"&estado=" + estado_reporte,'_blank')

    window.open(environment.ReportingUrl +"rpt_pre_detalle_idp.pdf?&j_username="  + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde+"&fechaFin=" + this.filter.fecha_hasta+"&estado=" + estado_reporte,'_blank')

  }
  
  showExcel(){
    console.log(this.filter.estado)
    let estado_reporte=''
    if(this.filter.estado==undefined || this.filter.estado== '' || this.filter.estado== 0){
      estado_reporte= 'T';
    }else{
      estado_reporte= this.filter.estado
    }
   
    window.open(environment.ReportingUrl +"rpt_pre_detalle_idp.xlsx?&j_username="  + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde+"&fechaFin=" + this.filter.fecha_hasta+"&estado=" + estado_reporte,'_blank')
    
  }

}
