import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultasService } from './multas.service';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
//import { ModalSolicitudComponent } from 'src/app/view/tesoreria/pagos/orden/modal-solicitud/modal-solicitud.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';

import { ModalCuentPreComponent } from 'src/app/view/tesoreria/recaudacion/configuracion-contable/modal-cuent-pre/modal-cuent-pre.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { CierreMesService } from '../../ciclos-contables/cierre-de-mes/cierre-mes.service';
@Component({
standalone: false,
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.scss']
})
export class MultasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Registro de Multas";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  proveedorActive: any = {
    razon_social: ""
  };
  verifyRestore = false;
  documento: any = {
    fk_proveedor: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    total: 0,
    fk_solicitud: null,
    fk_cuenta_contable: null,
    documento:"",
    tipo_proceso:"",
    nro_proceso :"",
    nombre_proceso :"",
    monto_proceso :"",
    nro_poliza:"",
    vigencia_poliza :moment(new Date()).format('YYYY-MM-DD'),
    idp:""
  }
  nro_proceso =""
  nombre_proceso =""
  monto_proceso =""
  nro_poliza:""
  vigencia_poliza =moment(new Date()).format('YYYY-MM-DD')
  tipo_desembolso =0
  idp=""
  estado=""
  codigo_cuenta=""
  nombre_cuenta =""
  tipo_proceso: any
  multasDisabled = false
  id:any
  habilitarProceso : boolean = true
  habilitarTipoProceso : boolean = true

  tipoProceso =[
    {value: 'CON', label:'Contratacion'},
    {value: 'INF', label:'Infimas'},
    {value: 'CAT', label:'Catalogo Electronico'}
  ]

  lastRecord: number|null = null
  totalRecords: number = 0
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: MultasService,
    private cierremesService: CierreMesService) {

      this.commonVrs.selectProveedorCustom.asObservable().subscribe(
        (res) => {
          //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(res);
          // this.cargarDatosModal(res);
          this.documento.fk_proveedor = res['id_proveedor']
          this.proveedorActive = res;
          console.log(this.proveedorActive);
          // this.titulosDisabled = false;
          // this.cuentaDisabled = false;
          //this.addConcepto = true;
          this.vmButtons[0].habilitar = false;
          this.habilitarTipoProceso = false

          //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.formaPago);
        }
      );
      this.commonVrs.seleciconSolicitud.asObservable().subscribe(
        (res)=>{
          console.log(res);
          this.documento.fk_solicitud = res['id_solicitud']
          this.documento.nombre_proceso = res['tipo_proceso']
          this.documento.nro_proceso = res['num_solicitud']
          this.documento.monto_proceso = res['valor']
          this.documento.vigencia_poliza = res['poliza']['fecha_finalizacion']
          this.documento.nro_poliza = res['poliza']['num_poliza']
          this.documento.idp = res['idp']

        }
      )
      this.commonVrs.seleciconCategoriaCuentaPro.asObservable().subscribe(
        (res)=>{
          console.log(res);
          this.documento.fk_cuenta_contable = res['data']['id']
          this.codigo_cuenta = res['data']['codigo']
          this.nombre_cuenta = res['data']['nombre']
            // this.grupo.id_cuenta_contable = res['data']['id'];
            // this.grupo.codigo_cuenta_contable = res['data']['codigo'];
            // this.grupo.descripcion_cuenta = res['data']['nombre'];
            // this.addConcepto = false;
            // this.titulosDisabled = false;
            // this.condicionDisabled = false;
            // this.addCondicion = false;
        }
      )
      this.commonVrs.selecContMultas.asObservable().subscribe(
        (res: any)=>{
          console.log(res)
          this.id = res['id_documento']
          this.documento.documento = res['documento']
          this.documento.fecha = moment(res.fecha).format('YYYY-MM-DD')
          this.estado = res['estado']
          this.proveedorActive = res['proveedor']
          this.documento.nro_proceso = res['nro_proceso']
          this.documento.nombre_proceso = res['nombre_proceso']
          this.documento.monto_proceso = res['monto_proceso']
          this.documento.nro_poliza = res['nro_poliza']
          this.documento.vigencia_poliza = res['vigencia_poliza']
          this.documento.idp = res['idp']
          this.codigo_cuenta=res.cuenta_contable?.codigo
          this.nombre_cuenta =res.cuenta_contable?.nombre
          this.documento.total = res['total']
          this.documento.tipo_proceso = res.solicitud?.tipo_proceso

          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.multasDisabled = true
        }
      )
     }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      }
    ]
  }
  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.saveMulta();
        break;
      case " BUSCAR":
        this.expandListBusqueda()
        break;
      case "ANULAR":
        this.anular()

        break;
      case " LIMPIAR":
        this.limpiar()
        break;

      default:
        break;
    }
  }

  tipoSelected(event) {
    console.log(event);
    if(this.tipo_proceso!=undefined || this.tipo_proceso!=''){
      this.habilitarProceso= false
    }else{
      this.habilitarProceso= true
    }

  }


  expandListProveedores() {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;

  }

  modalSolicitud(){
    if(!this.proveedorActive.id_proveedor){
      this.toastr.info('Debe seleccionar primero un proveedor')
    }else {
      let modal = this.modalService.open(ModalSolicitudComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      })
      modal.componentInstance.proveedor = this.proveedorActive
      modal.componentInstance.tipo_proceso = this.documento.tipo_proceso
    }
  }

  modalCuentaContable(){
    let modal = this.modalService.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true

  }

  saveMulta(){

   Swal.fire({
     icon: "warning",
     title: "¡Atención!",
     text: "Está a punto de guardar una multa ¿Desea continuar?",
     showCloseButton: true,
     showCancelButton: true,
     showConfirmButton: true,
     cancelButtonText: "Cancelar",
     confirmButtonText: "Aceptar",
     cancelButtonColor: '#F86C6B',
     confirmButtonColor: '#4DBD74',
   }).then((result)=>{
     if(result.isConfirmed){
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM')),
      }
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

        /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {

          this.msgSpinner = 'Guardando...';
          this.lcargando.ctlSpinner(true);
          let data2 = {
            documento :this.documento
          }
          console.log(data)
          this.apiSrv.setRecDocumento(data2).subscribe(
            (res)=>{
              console.log(res)
              Swal.fire({
                icon: "success",
                title: "Documento de multa generado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.documento = res['data']

              this.lcargando.ctlSpinner(false);
              this.vmButtons[2].habilitar = true;
              this.vmButtons[0].habilitar = true;
              this.vmButtons[3].habilitar = false;
            },
            (error) => {
             this.lcargando.ctlSpinner(false);
             Swal.fire({
               icon: "error",
               title: "Error al generar el documento de pago",
               text: error.error.message,
               showCloseButton: true,
               confirmButtonText: "Aceptar",
               confirmButtonColor: '#20A8D8',
             });
           }
         );

        } else {
          this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }

        }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.mesagge);
        })
    }else{
      this.lcargando.ctlSpinner(false);
    }
  });
}

expandListBusqueda() {

  const modalInvoice = this.modalService.open(ListBusquedaComponent, {
    size: "xl",
    backdrop: "static",
    windowClass: "viewer-content-general",
  });
  //modalInvoice.componentInstance.module_comp = myVarGlobals.fContratacion;

}

limpiar(){
  this.documento = {
    fk_proveedor: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    total: 0,
    fk_solicitud: null,
    fk_cuenta_contable: null,
    documento:"",
    tipo_proceso:"",
    nro_proceso :"",
    nombre_proceso :"",
    monto_proceso :"",
    nro_poliza:"",
    vigencia_poliza :moment(new Date()).format('YYYY-MM-DD'),
    idp:""
  }
  this.estado='P'
  this.codigo_cuenta=""
  this.nombre_cuenta =""

  this.proveedorActive = {
    razon_social: ""
  };
  this.habilitarProceso= true
  this.habilitarTipoProceso = true
}

anular(){
  Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: "¿Seguro que desea anular está multa?",
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74'
  }).then((result)=>{
    if(result.isConfirmed){

      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM')),
      }
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

        /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {
          this.msgSpinner = 'Anulando Multa...';
          this.lcargando.ctlSpinner(true);
          this.estado = 'A'
          let data2 = {
            id:this.id,
            estado:'A'
          }
          this.apiSrv.updateEstado(data2).subscribe(
            (res)=>{
              console.log(res)
              if(res["status"]==1){
                this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Se actualizó con éxito",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result)=>{
              if(result.isConfirmed){
                this.lcargando.ctlSpinner(false);
              }
            })
              }
              else{
                this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8'
            });
              }

            },
            (error)=>{
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )


        } else {
          this.toastr.info("No se puede anular porque el periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }

        }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.mesagge);
        })

    }else {
      this.lcargando.ctlSpinner(false);
    }
  })



}

async getLatest() {
  this.lcargando.ctlSpinner(true)
  this.msgSpinner = 'Cargando Registro'
  try {
    const response = await this.apiSrv.getUltimaMulta()
    console.log(response)
    if (response.data) {
      // this.totalRecords = response.data.total
      this.lastRecord = response.data.id_documento
      this.commonVrs.selecContMultas.next(response.data)
      this.lcargando.ctlSpinner(false)
    } else {
      this.limpiar()
      this.lcargando.ctlSpinner(false)
      Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
    }
    //
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error?.message, 'Error cargando Registro')
  }
}

async handleEnter({key}) {
  if (key === 'Enter') {
    if (this.lastRecord == null) {
      await this.getLatest()
      return
    }

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Registro'
    try {
      const response = await this.apiSrv.getMultas({params: {filter: {id: this.lastRecord}, paginate: {page: 1, perPage: 1}}}) as any
      console.log(response)
      if (response.data.data.length > 0) {
        this.totalRecords = response.data.total
        this.commonVrs.selecContMultas.next(response.data.data[0])
        this.lcargando.ctlSpinner(false)
      } else {
        this.limpiar()
        this.lcargando.ctlSpinner(false)
        Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      }
      //
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }
}

async getPrevRecord() {
  this.lastRecord -= 1
  await this.handleEnter({key: 'Enter'})
}

async getNextRecord() {
  this.lastRecord += 1
  await this.handleEnter({key: 'Enter'})
}


}
