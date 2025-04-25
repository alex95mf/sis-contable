import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ReporteAcfijoService } from "./reporte-acfijo.services";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

declare const $: any;

@Component({
  selector: 'app-reporte-acfijo',
  templateUrl: './reporte-acfijo.component.html',
  styleUrls: ['./reporte-acfijo.component.scss']
})
export class ReporteAcfijoComponent implements OnInit {
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  permisions: any;
  dataUser: any;
  arrayProveedor: Array<any> = [];
  arrayGrupo: Array<any> = [];
  arrayTipo: Array<any> = [];
  arrayForma: Array<any> = [];
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  proveedor:any;
  tipo: any;
  forma:any;
  retencion:any;
  disabledDataNo: any = false;
  disabledDataSi: any = false;
  processingtwo: any = false;
  dtactFijo: Array<any> = [];
  dtInformacion: any = {};
  arrayDtactFijo: Array<any> = [];

  vmButtons:any = [];
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReporteAcfijoService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnRepAcFj", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepAcFj", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepAcFj", paramAccion: "1", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepAcFj", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "LIMPIAR FILTROS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},

      { orig: "btnRepAcFjMdl", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "LIMPIAR FILTROS1":
        this.informaciondtlimpiar();
      break;
      case "EXCEL1":
        $('#tablaReporActFj').DataTable().button( '.buttons-excel' ).trigger();
      break;
      case "IMPRIMIR1":
        $('#tablaReporActFj').DataTable().button( '.buttons-print' ).trigger();       
      break;
      case "PDF1":
        $('#tablaReporActFj').DataTable().button( '.buttons-pdf' ).trigger();
      break; 
      case "CERRAR1":
        this.closeModal();
      break;
    }
  }

  getPermisions() {   
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      let id_rol = this.dataUser.id_rol;
      let data = {
        codigo: myVarGlobals.fRActivoFijo,
        id_rol: id_rol
      }
      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res['data'][0];
        if (this.permisions.ver == "0") {
          this.toastr.info("Usuario no tiene acceso a este formulario.");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          this.processing = true;
          this.getProveedores();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }

    getProveedores() {
      this.reportesSrv.getProveedores().subscribe(res => {
        this.arrayProveedor = res['data'];
        this.getCatalogos();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      })
    }
    
    getCatalogos() {
      let data = {
        params: "'TIPO PAGO','FORMA PAGO'"
      }
      this.reportesSrv.getCatalogos(data).subscribe(res => {
        this.arrayTipo = res['data']['TIPO PAGO'];
        this.arrayForma = res['data']['FORMA PAGO'];
        this.getDt()
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message)
      })
    }

    getDt() {
      this.reportesSrv.getAtivosFijosDT().subscribe(res => {
        this.arrayDtactFijo = res['data'];
        this.getTableReport();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      })
    }

   getTableReport() {
      let data = {
        dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
        dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
        proveedor: this.proveedor  == undefined ? null : this.proveedor,
        tipo: this.tipo  == undefined ? null : this.tipo,
        forma: this.forma  == undefined  ? null : this.forma,
        retencion: this.retencion  == undefined  ? null : this.retencion 
  }
   this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 5,
    search: true,
    paging: true,
    dom: "frtip",
    scrollY: "200px",
    scrollCollapse: true,
    buttons: [
      {
        extend: "excel",
        footer: true,
        title: "Reporte",
        filename: "reportes",
        text: '<button class="btn btn-success" style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">EXCEL <i class="fa fa-file-excel-o" aria-hidden="true" style="font-size: 19px;margin-right: 10px; margin-top: 4px; margin:6px;"> </i></button>',
      },
      {
        extend: "print",
        footer: true,
        title: "Reporte",
        filename: "report print",
        text: '<button class="btn" style="width: 150px; height: 43px; font-weight: bold; background-color:#005CCD ; color:white; box-shadow: 2px 2px 0.5px #666;">IMPRIMIR<i class="fa fa-print" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;" ></i></button>',
      },
      {
        extend: "pdf",
        footer: true,
        title: "Reporte",
        filename: "Reporte",
        text: '<button class="btn btn-danger " style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">PDF <i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;"></i></button>',
      },
    ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
  };
  this.mensajeSppiner = "Cargando...";
  this.lcargando.ctlSpinner(true);
  this.reportesSrv.getAdquisiciones(data).subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.validaDt = true;
    this.processing = true;
    this.infoData = res['data'];
    setTimeout(() => {
      this.dtTrigger.next();
    }, 50);
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.validaDt = true;
    this.processing = true;
    setTimeout(() => {
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


filterRetencionSi(data){
  if(data == true){
    this.retencion = "1";
   this.disabledDataNo = true;
   this.rerender();
  }else{
   this.disabledDataNo = false;
   this.rerender();

  }
}

filterRetencionNo(data){
  if(data == true){
    this.retencion = "0";
   this.disabledDataSi = true;
   this.rerender();
   
  }else{
   this.disabledDataSi = false;
   this.rerender();
  }
}

filterProveedor(data){ 
  if (this.proveedor != undefined) {
    this.proveedor = data
    this.rerender();
    } else{
      this.rerender();
  }
}

filterTipo(data){ 
  if (this.tipo != undefined) {
    this.tipo = data
    this.rerender();
    } else{
      this.rerender();
  }
}

filterForma(data){ 
  if (this.forma != undefined) {
    this.forma = data
    this.rerender();
    } else{
      this.rerender();
  }
}

informaciondtlimpiar(){
 this.proveedor = undefined;
 this.forma = undefined;
 this.tipo = undefined;
 this.retencion = undefined;
 this.rerender();
}

informaDocumento(dt,i) {
  this.processingtwo = true;
  $('#modalReportactFijo').appendTo("body").modal('show');
  let modalDoc = this.arrayDtactFijo.filter((e) => e.fk_adquisicion == dt.id);
  this.dtactFijo = modalDoc;

  this.dtInformacion.codigo = dt.codigo;
  this.dtInformacion.numero = dt.num_doc;
  this.dtInformacion.proveedor = dt.razon_social;
  this.dtInformacion.autorizacion = dt.autorizacion;
  this.dtInformacion.fecha = dt.fecha_compra;
  this.dtInformacion.ivaPorcentaje = dt.iva;
  this.dtInformacion.subtotal = dt.subtotal;
  this.dtInformacion.iva = dt.iva;
  this.dtInformacion.valor_iva = dt.valor_iva;
  this.dtInformacion.total  = dt.total;

} 

closeModal() {
  ($("#modalReportactFijo") as any).modal("hide");
  this.processingtwo = false;
  this.dtInformacion = {};
  this.dtactFijo = [];
}


}
