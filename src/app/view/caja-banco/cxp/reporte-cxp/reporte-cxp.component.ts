import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ReporteCxpService } from "./reporte-cxp.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
  selector: 'app-reporte-cxp',
  templateUrl: './reporte-cxp.component.html',
  styleUrls: ['./reporte-cxp.component.scss']
})
export class ReporteCxpComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataUser: any;
  processing: any = false;
  permisions: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  validaDt: any = false;
  infoDt: any;
  proveedor: any = 0;
  factura:any = 0; 
  retencion:any;
  arrayProveedor: Array<any> = [];
  arrayFactura: Array<any> = [];
  arrayRetencion: Array<any> = [];
  arrayDocument: Array<any> = [];
  arrayDtCxPagar: Array<any> = [];
  usuarios: Array<any> = [];
  dtCxPagar: Array<any> = [];
  disabledDataNo: any = false;
  disabledDataSi: any = false;
  processingtwo: any = false;
  dtInformacion: any = {};
  locality: any;
  vmButtons: any;
  mensajeSppiner: string = "Cargando...";
  retencionSi:any;
  retencionNo:any;
  valorData:any;
  dataFac:any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReporteCxpService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnRepCxp", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepCxp", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepCxp", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepCxp", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
      { orig: "btnReportCxpProveedor", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
      { orig: "btnReportCxpInf", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR " }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case "CANCELAR":
            this.informaciondtlimpiar();
        break;
        case "EXCEL":
          $('#tablaReporCCxP').DataTable().button( '.buttons-csv' ).trigger();
        break;
        case "IMPRIMIR":
          $('#tablaReporCCxP').DataTable().button( '.buttons-print' ).trigger();       
        break;
        case "PDF":
          $('#tablaReporCCxP').DataTable().button( '.buttons-pdf' ).trigger();
        break;
        case "CERRAR":
          this.closeModal2();
        break;
        case "CERRAR ":
          this.closeModal();
        break;
    }   
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fReportCtaPagar,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver Reportes Cuentas por pagar");
        this.vmButtons = [];
      } else {
        this.processing = true;
        this.getCliente();    
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCliente() {
    this.reportesSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getFacturaData();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  

  getTableReport() {
    this.valorData  == false ? this.retencion = undefined : this.retencion;
    let data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      proveedor: this.proveedor  == 0 ? null : this.proveedor,
      retencion: this.retencion  == undefined  ? null : this.retencion
    }
        this.dtOptions = {
               pagingType: "full_numbers",
               pageLength: 10,
               search: true,
               paging: true,
               order: [[ 1, "desc" ]],
/*                scrollY: "200px",
               scrollCollapse: true, */
          buttons: [
                 {
                   extend: "csv",
                   footer: true,
                   charset: 'UTF-8',
                   title: "Reporte ",
                   bom: true,
                   filename: "Excel",
         },
                 {
                   extend: "print",
                   footer: true,
                   title: "Reporte ",
                   filename: "Print",
            },
           {
                   extend: 'pdf',
                   footer: true,
                   title: 'Reporte ',
                   filename: 'Pdf',
          }
         ],
       language: {
         url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
       },
     };
     this.mensajeSppiner = "Cargando...";
     this.lcargando.ctlSpinner(true);
     this.reportesSrv.getReportCXP(data).subscribe(res => {
       this.lcargando.ctlSpinner(false);
       this.validaDt = true;
       this.processing = true;
       this.infoDt = res['data'];
       this.getDataPrincipal();
       setTimeout(() => {
         this.dtTrigger.next();
       }, 50);
     }, error => {
       this.lcargando.ctlSpinner(false);
       this.validaDt = true;
       this.processing = true;
       setTimeout(() => {
         this.lcargando.ctlSpinner(false);
         this.dtTrigger.next();
       }, 50);
       this.toastr.info(error.error.message);
     });
  }

  rerender(): void {
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  getDataPrincipal(){
          for (let i = 0; i < this.infoDt.length; i++) {
            if((this.infoDt[i]["letras_canceladas"] == this.infoDt[i]["letras"]) ){
              this.infoDt[i]["status"] = 'Pagado';
           }else if ((this.infoDt[i]["letras_vencidas"] > 0)){
            this.infoDt[i]["status"] = 'Vencido';
         }else if ((this.infoDt[i]["letras_pendientes"] > 0)){
          this.infoDt[i]["status"] = 'Pendiente';
       }
      }
  }

  getFacturaData(){
    this.reportesSrv.getFactura().subscribe(res => {
      this.arrayFactura = res['data'];
      this.getRetencionData();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  getRetencionData(){
    this.reportesSrv.getRetencion().subscribe(res => {
      this.arrayRetencion = res['data'];
     this.getDocumentos();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  
  getDocumentos(){
    this.reportesSrv.getDocument().subscribe(res => {
      this.arrayDocument = res['data'];
      this.getDetalle();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  getDetalle(){
    this.reportesSrv.getCuentasXpagarDT().subscribe(res => {
      this.arrayDtCxPagar= res['data'];
      this.getUser();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  getUser(){
    this.reportesSrv.getUsers().subscribe(res => {
      this.usuarios= res['data'];
      this.getTableReport();
    },error=>{
      this.lcargando.ctlSpinner(false);
    })
  }


  filterRetencionSi(data){
    
    if(data == true){
      this.valorData = data;
      this.retencion = "SI";
     this.disabledDataNo = true;
     this.rerender();
    }else{
     this.valorData = data;
     this.disabledDataNo = false;
     this.rerender();

    }
  }

  filterRetencionNo(data){
    if(data == true){
      this.valorData = data;
      this.retencion = "NO";
     this.disabledDataSi = true;
     this.rerender();
    }else{
     this.valorData = data;
     this.disabledDataSi = false;
     this.rerender();
    }
  }

  
  filterProveedor(data){ 

    if (this.proveedor != 0) {
      this.proveedor = data
      this.rerender();
      } else{
        this.rerender();
    }
  }
  
  filterFactura(data){ 
    if (this.factura != 0) {
      this.factura = data
      this.rerender();
       } else{
        this.rerender();
        }
  }

  closeModal() {
    ($("#modalReportcXpagar") as any).modal("hide");
    this.processingtwo = false;
    this.dtInformacion = {};
    this.dtCxPagar = [];
  }

  informaDocumento(dt,i) {
    let modalDoc = this.arrayFactura.filter((e) => e.numFactura == dt.doc_num);
    $('#modalReportcXpagar').appendTo("body").modal('show');
    this.dataFac = modalDoc.length;
    if(modalDoc.length == 0){
      this.processingtwo = true;


      let filt = this.arrayDtCxPagar.filter((e) => e.doc_ref_num == dt.doc_num);
      this.dtCxPagar = filt;

      for (let i = 0; i < this.dtCxPagar.length; i++) {
        let fechaActual = moment(this.toDatePicker).format("YYYY-MM-DD")
       if ((this.dtCxPagar[i]["fecha_venc"] == fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0 ) && (this.dtCxPagar[i]["valor_saldo"] != 0) ){
          this.dtCxPagar[i]["estado"] = 'Pendiente';
       }else if((this.dtCxPagar[i]["fecha_venc"] < fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0) && (this.dtCxPagar[i]["valor_saldo"] != 0)   ){
          this.dtCxPagar[i]["estado"] = 'Vencido';
       }
       else if ((this.dtCxPagar[i]["fecha_venc"] > fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0) && (this.dtCxPagar[i]["valor_saldo"] != 0)  ){
         this.dtCxPagar[i]["estado"] = 'Pendiente';
      }  else if ((this.dtCxPagar[i]["valor_saldo"] == 0) &&  (this.dtCxPagar[i]["valor"] == this.dtCxPagar[i]["valor_abono"])){
        this.dtCxPagar[i]["estado"] = 'Pagado';
       }
      }
      }else{

      if(modalDoc[0].codigo != undefined){
      this.processingtwo = true;
      this.dtInformacion.codigo = modalDoc[0].codigo;
      this.dtInformacion.numero = modalDoc[0].numFactura;
      this.dtInformacion.autorizacion = modalDoc[0].autorizacion;
      this.dtInformacion.fecha = modalDoc[0].fecha;
      this.dtInformacion.ivaPorcentaje = modalDoc[0].iva_porcentaje;
      this.dtInformacion.tipoPago = modalDoc[0].tipo_pago;
      this.dtInformacion.formaPago = modalDoc[0].forma_pago;
      this.dtInformacion.despacho = modalDoc[0].despacho;
      let user = this.usuarios.find((e) => e.id_usuario == modalDoc[0].user_received);
      this.dtInformacion.aprobacion = user.nombre;
      this.dtInformacion.asesor = modalDoc[0].nombreUsuario;
      this.dtInformacion.iva = modalDoc[0].iva_valor;
      this.dtInformacion.subtotal = modalDoc[0].subtotal;
      this.dtInformacion.total = modalDoc[0].total;
      this.dtInformacion.cuotas = modalDoc[0].num_cuotas;
      this.dtInformacion.retencion = modalDoc[0].hasRetencion;
      let filt = this.arrayDtCxPagar.filter((e) => e.doc_ref_num == dt.doc_num);
      this.dtCxPagar = filt;
      for (let i = 0; i < this.dtCxPagar.length; i++) {
        let fechaActual = moment(this.toDatePicker).format("YYYY-MM-DD")
       if ((this.dtCxPagar[i]["fecha_venc"] == fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0 ) && (this.dtCxPagar[i]["valor_saldo"] != 0) ){
          this.dtCxPagar[i]["estado"] = 'Pendiente';
       }else if((this.dtCxPagar[i]["fecha_venc"] < fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0) && (this.dtCxPagar[i]["valor_saldo"] != 0)   ){
          this.dtCxPagar[i]["estado"] = 'Vencido';
       }
       else if ((this.dtCxPagar[i]["fecha_venc"] > fechaActual) &&  (this.dtCxPagar[i]["valor_saldo"] >= 0) && (this.dtCxPagar[i]["valor_saldo"] != 0)  ){
         this.dtCxPagar[i]["estado"] = 'Pendiente';
      }  else if ((this.dtCxPagar[i]["valor_saldo"] == 0) &&  (this.dtCxPagar[i]["valor"] == this.dtCxPagar[i]["valor_abono"])){
        this.dtCxPagar[i]["estado"] = 'Pagado';
       }
      }
     }
    }
  } 
  
  
  closeModal2() {
    ($("#modalReportProveedor") as any).modal("hide");
    this.processingtwo = false;
    this.dtInformacion = {};
  }

  informaCliente(dt,i) {
    $('#modalReportProveedor').appendTo("body").modal('show');
    this.processingtwo = true;
    let modalDoc = this.arrayProveedor.filter((e) => e.id_proveedor == dt.fk_provider);
    this.dtInformacion.nombreC = modalDoc[0].nombre_comercial_prov;
    this.dtInformacion.razon = modalDoc[0].razon_social;
    this.dtInformacion.legal = modalDoc[0].representante_legal;
    this.dtInformacion.website = modalDoc[0].website;
    this.dtInformacion.cliente = modalDoc[0].nombre_comercial_prov;
    this.dtInformacion.Tdocumento = modalDoc[0].tipo_documento;
    this.dtInformacion.documento = modalDoc[0].num_documento;
    this.dtInformacion.persona = modalDoc[0].tipo_persona;
    this.dtInformacion.provincia = modalDoc[0].provincia;
    this.dtInformacion.pais = modalDoc[0].pais;
    this.dtInformacion.ciudad = modalDoc[0].ciudad;
    this.dtInformacion.direccion = modalDoc[0].direccion;
    this.dtInformacion.telefono = modalDoc[0].telefono;
    this.dtInformacion.credito = modalDoc[0].cupo_credito;

  }

  informaciondtlimpiar(){
    this.rerender();
    this.proveedor = 0;
    this.factura = 0;
    this.retencion = undefined;
    this.fromDatePicker = new Date(
    this.viewDate.getFullYear(),
    this.viewDate.getMonth(), 1);
    this.toDatePicker = new Date();
  }

  formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 2
		})
		params = params.replace(/[,.]/g, function (m) {
			return m === ',' ? '.' : ',';
		});
		return params;
	}

}
