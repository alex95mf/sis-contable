import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { ReportNdebitoService } from "./report-nota-debito.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
declare const $: any;
@Component({
standalone: false,
  selector: 'app-report-nota-debito',
  templateUrl: './report-nota-debito.component.html',
  styleUrls: ['./report-nota-debito.component.scss']
})
export class ReportNotaDebitoComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  processingtwo: any = false;
  permisions: any;
  dataUser: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayTipoAgente: Array<any> = [
    { name: "Cliente" },
    { name: "Proveedor" },
  ];
  statusDocuments: any = [
    { id: 1, name: "En Proceso" },
    { id: 4, name: "Aprobado" },
  ];

  arrayClientes: Array<any> = [];
  arrayMotivos: Array<any> = [];
  arraySucursales: Array<any> = [];
  arrayDtNotaCredito: Array<any> = [];
  dtnotaCredito: Array<any> = [];
  dtInformacion: any = {};
  Tagente:any = 0;
  agente:any = 0;
  motivo:any = 0;
  sucursal:any= 0;
  statusFilter:any = 0;
  vmButtons:any = [];
  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReportNdebitoService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnRepNotDebcartera", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepNotDebcartera", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepNotDebcartera", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepNotDebcartera", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnRepNotDebcartera", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ];
  /*   this.processing = true; */
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.getTableReport();
    this.getClientes();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto){
      case "LIMPIAR":
        this.informaciondtlimpiar();
      break;
      case "CERRAR":
       this.closeModalDebito();
      break;
      case "EXCEL":
        $('#tablaReporNotDebito').DataTable().button( '.buttons-excel' ).trigger();
      break;
      case "IMPRIMIR":
        $('#tablaReporNotDebito').DataTable().button( '.buttons-print' ).trigger();       
      break;
      case "PDF":
        $('#tablaReporNotDebito').DataTable().button( '.buttons-pdf' ).trigger();
      break; 
    }
  }

  getClientes() {
    this.reportesSrv.getCliente().subscribe(res => {
      this.arrayClientes = res['data'];
      this.fillCatalog();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  fillCatalog() {
    let data = {
      params: "'NOTA CLIENTE'",
    };
    this.reportesSrv.getCatalogs(data).subscribe(res => {
      this.arrayMotivos = res["data"]["NOTA CLIENTE"];
      this.getsucursales();
      
    }, (error) => {
      this.toastr.info(error.error.message);
    });
  }

  getsucursales() {
    let data = {
      id_empresa: this.dataUser.id_empresa,
    }
    this.reportesSrv.getSucursal(data).subscribe(res => {
      this.arraySucursales = res['data'];
      this.getDT();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getDT() {
    this.reportesSrv.getdtNotaCredito().subscribe(res => {
      this.arrayDtNotaCredito = res['data'];
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getTableReport() {
    let data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      tipo_agente: this.Tagente  == 0 ? null : this.Tagente,
      agente: this.agente  == 0 ? null : this.agente,
      motivo: this.motivo  == 0  ? null : this.motivo,
      sucursal: this.sucursal  == 0 ? null : this.sucursal,
      doc: this.statusFilter  == 0 ? null : this.statusFilter,
      tipoNota: "NDD-V"
}

 this.dtOptions = {
  pagingType: 'full_numbers',
  pageLength: 5,
  search: true,
  paging: true,
  dom: "Bfrtip",
  buttons: [
    {
      extend: "excel",
      footer: true,
      title: "Reporte",
      filename: "reportes",
    },
    {
      extend: "print",
      footer: true,
      title: "Reporte",
      filename: "report print",
    },
    {
      extend: "pdf",
      footer: true,
      title: "Reporte",
      filename: "Reporte",
    },
  ],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
    }
};
this.reportesSrv.getReportNotaCredito(data).subscribe(res => {
  this.validaDt = true;
  this.processing = true;
  this.infoData = res['data'];
  if (this.infoData.length > 0) {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
} else {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
} 
  setTimeout(() => {
    this.dtTrigger.next(null);
  }, 50);
}, error => {
  this.validaDt = true;
  this.processing = true;
  setTimeout(() => {
    this.dtTrigger.next(null);
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

filterTagente(data){ 
  if (this.Tagente != 0) {
    this.Tagente = data;
    this.rerender();
    } else{
      this.rerender();
  }
}

filterAgente(data){ 
if (this.agente != 0) {
  this.agente = data;
  this.rerender();
  } else{
    this.rerender();
}
}

filterMotivo(data){ 
if (this.motivo != 0) {
  this.motivo = data;
  this.rerender();
  } else{
    this.rerender();
}
}

filterSucursal(data){ 
if (this.sucursal != 0) {
  this.sucursal = data;
  this.rerender();
  } else{
    this.rerender();
}
}

filterEstado(data){ 
if (this.statusFilter != 0) {
  this.statusFilter = data;
  this.rerender();
  } else{
    this.rerender();
}
}

informaciondtlimpiar(){
this.Tagente = 0;
this.agente = 0;
this.motivo = 0;
this.sucursal = 0;
this.statusFilter = 0;
this.rerender();
}


informaDocumento(dt,i) {
this.processingtwo = true;
$('#modalReportnotaCredito').appendTo("body").modal('show');
let modalDoc = this.arrayDtNotaCredito.filter((e) => e.fk_notas == dt.id);
this.dtnotaCredito = modalDoc;

this.dtInformacion.codigo = dt.codigo;
this.dtInformacion.nombre = dt.nombre;
this.dtInformacion.secuencia_doc = dt.secuencia_doc.toString().padStart(10, '0');
this.dtInformacion.tipo_agente = dt.tipo_agente;
this.dtInformacion.ruc = dt.ruc;
this.dtInformacion.razon_social = dt.razon_social;
this.dtInformacion.telefono = dt.telefono;
this.dtInformacion.ciudad = dt.ciudad;
this.dtInformacion.causa = dt.causa;
this.dtInformacion.concepto = dt.concepto;
this.dtInformacion.nombreSucursal = dt.nombreSucursal;
this.dtInformacion.nombreEmpresa = dt.nombreEmpresa;
this.dtInformacion.valor_disponible = dt.valor_disponible;
this.dtInformacion.valor_usado = dt.valor_usado;
this.dtInformacion.total  = dt.total;
this.dtInformacion.estado  = (dt.filter_doc != '4') ? 'En proceso' : 'Aprobada';
this.dtInformacion.name_user_aprobated  =  (dt.filter_doc != null) ? 'Ninguno' : dt.name_user_aprobated;


} 

closeModal() {
($("#modalReportnotaCredito") as any).modal("hide");
this.processingtwo = false;
   this.dtInformacion = {};
  this.dtnotaCredito = [];
}

closeModalDebito() {
  ($("#modalNDebitoReport") as any).modal("hide");

}

}