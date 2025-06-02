import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { ReporteQuotesService } from "./reporte-quotes.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-reporte-quotes',
  templateUrl: './reporte-quotes.component.html',
  styleUrls: ['./reporte-quotes.component.scss']
})
export class ReporteQuotesComponent implements OnInit {
    mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  permisions: any;
  dataUser: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayClientes: Array<any> = [];
  arrayAsesores: Array<any> = [];
  arrayQuotes: Array<any> = [];
  dtproforma: Array<any> = [];
  arrayQuotesDT: Array<any> = [];
  dtInformacion: any = {};
  proforma: any = 0;
  cliente: any = 0;
  asesor: any = 0;
  estado: any = 0;
  empresLogo: any;
  documento: any = 0;
  processingtwo: any = false;
  dsPrint: any = false;
  vmButtons: any;
  vmButtonsdt:any;
  status: any = [
    { name: "En Procesos" },
    { name: "Vendido" },
    { name: "Perdido" },
    { name: "Rechazado" },
    { name: "Aprobado" },
  ];
  locality:any;
  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReporteQuotesService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.vmButtons = [
      { orig: "btnsReportQuotes", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsReportQuotes", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsReportQuotes", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsReportQuotes", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.vmButtonsdt = [
      { orig: "btnsReportQuotesdt", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false,printSection: "print-section-dt", imprimir: true },
    ];


    setTimeout(() => {
      this.processing = true;
      this.empresLogo = this.dataUser.logoEmpresa;
      this.getClientes();
      this.getTableReport();
    }, 10);
  }

  getClientes() {

    this.reportesSrv.getCliente().subscribe(res => {
      this.arrayClientes = res['data'];
      this.getAsesores();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getAsesores() {
    this.reportesSrv.getAsesor().subscribe(res => {
      this.arrayAsesores = res['data'];
      this.getCotizaciones();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getCotizaciones() {
    this.reportesSrv.getQuotes().subscribe(res => {
      this.arrayQuotes = res['data'];
      this.getQuotesdt();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getQuotesdt() {
    this.reportesSrv.getReportCotizacionDT().subscribe(res => {
      this.arrayQuotesDT = res['data'];
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getTableReport() {
    let data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      usuario: this.dataUser.id_usuario,
      proforme: this.proforma == 0 ? null : this.proforma,
      cliente: this.cliente == 0 ? null : this.cliente,
      asesor: this.asesor == 0 ? null : this.asesor,
      estado: this.estado == 0 ? null : this.estado,
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      dom: "lfrtip",
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
    this.reportesSrv.getReportCotizacion(data).subscribe(res => {
      this.validaDt = true;
      this.processing = true;

      this.infoData = res['data'];
      if (this.infoData.length == 0) {
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = true;
      } else {
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
      }
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.validaDt = true;
      this.processing = true;
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.lcargando.ctlSpinner(false);
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
    });
  }

  rerender(): void {
    this.validaDt = false;
    this.lcargando.ctlSpinner(true);
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  informaciondtlimpiar() {
    this.proforma = 0;
    this.cliente = 0;
    this.asesor = 0;
    this.estado = 0;
    this.viewDate = new Date();
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.rerender();
  }


  filterProforma(data) {
    this.lcargando.ctlSpinner(true);
    if (this.proforma != 0) {
      this.proforma = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterCliente(data) {
    this.lcargando.ctlSpinner(true);
    if (this.cliente != 0) {
      this.cliente = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterAsesor(data) {
    this.lcargando.ctlSpinner(true);
    if (this.asesor != 0) {
      this.asesor = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterEstado(data) {
    this.lcargando.ctlSpinner(true);
    if (this.estado != 0) {
      this.estado = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterDocumento(data) {
    this.lcargando.ctlSpinner(true);
    if (this.documento != 0) {
      this.documento = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }


  informaDocumento(dt, i) {
    this.processingtwo = true;
    this.lcargando.ctlSpinner(true);
    $('#modalReportaQuotes').appendTo("body").modal('show');
    let modalDoc = this.arrayQuotesDT.filter((e) => e.fk_ven_cotizador == dt.id);
    this.dtproforma = modalDoc;
    this.dtInformacion.NombreDocumento = dt.NombreDocumento;
    this.dtInformacion.codigo = dt.codigo;
    this.dtInformacion.nombre = dt.nombre;
    this.dtInformacion.secuence = dt.secuence.toString().padStart(10, '0');
    this.dtInformacion.nombreUser = dt.nombreUser;
    this.dtInformacion.ruc = dt.ruc;
    this.dtInformacion.razon_social = dt.razon_social;
    this.dtInformacion.fecha = dt.fecha;
    this.dtInformacion.nombre_comercial_cli = dt.nombre_comercial_cli;
    this.dtInformacion.num_documento = dt.num_documento;
    this.dtInformacion.telefono = dt.telefono;
    this.dtInformacion.type_payment = dt.type_payment;
    this.dtInformacion.status = dt.status;
    this.dtInformacion.subtotal = dt.subtotal;
    this.dtInformacion.iva = dt.iva;
    this.dtInformacion.total = dt.total;
    this.dtInformacion.estado = (dt.filter_doc != '1') ? 'En proceso' : 'Aprobada';
    this.dtInformacion.name_user_aprobated = (dt.filter_doc != null) ? 'Ninguno' : dt.name_user_aprobated;
    this.dsPrint = true;
    this.lcargando.ctlSpinner(false);
  }

  closeModal() {
    this.lcargando.ctlSpinner(true);
    ($("#modalReportaQuotes") as any).modal("hide");
    this.processingtwo = false;
    this.dtproforma = [];
    this.lcargando.ctlSpinner(false);
  }



  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.informaciondtlimpiar();
      break;
      case "EXCEL":
        $('#tablaReportQuote').DataTable().button('.buttons-excel').trigger();
        break;
      case "PDF":
        $('#tablaReportQuote').DataTable().button('.buttons-pdf').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaReportQuote').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

  metodoGlobaldt(evento: any) {
    switch (evento.items.boton.texto) {
      case "IMPRIMIR":
        this.savePrint();
        break;
    }
  }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion Reporte de Cotización",
      id_controlador: myVarGlobals.fCotizaciones,
    }
    this.reportesSrv.printData(data).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
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


