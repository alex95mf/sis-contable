import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as myVarGlobals from "../../../../global";
import { ReportQuotesService } from "./report-quotes.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-report-quotes',
  templateUrl: './report-quotes.component.html',
  styleUrls: ['./report-quotes.component.scss']
})
export class ReportQuotesComponent implements OnInit {

  @ViewChild('printCDI') printCDI: ElementRef;
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  processing: any = false;
  processingQuotes: boolean = false;
  flag: number = 0;
  processingtwo: boolean = false;
  dataUser: any;
  dataCuenta: any;
  permissions: any;
  validaDtUser: any = false;
  guardarolT: any = [];
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(
    this.viewDate.getFullYear(),
    this.viewDate.getMonth(),
    1
  );

  toDatePicker: Date = new Date();
  id_usuario: any;
  perfil: any;

  clientes: Array<any> = [];
  vendedores: Array<any> = [];
  detalle: Array<any> = [];
  detalleClick: Array<any> = [];
  cliente: any = 0;
  vendedor: any = 0;
  formaPagofull: any = 0;
  formaPago: Array<any> = [
    { name: "Contado" },
    { name: "Crédito" },
  ];

  dataCliente: any;
  id_cliente: any;
  documentoDetalle: any = {};
  vmButtons: any = [];
  locality: any;
  dataTotal: any = {};
  secuenceDet: any;
  print_cdi: any;

  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  dateNow: any;
  ivaConverter:any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private reportInvoice: ReportQuotesService,
    private commonServices: CommonService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService
  ) {
    this.commonVarSrv.setModalCliente.asObservable().subscribe((res) => {
      this.cliente = res.id_cliente;
      this.rerender();
    });
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsRquotes", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsRquotes", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsRquotes", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: false, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsRquotes", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];
    setTimeout(() => {
      this.validatePermission();
    }, 10);
  }

  validatePermission() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.id_usuario = this.dataUser.id_usuario;
    this.perfil = this.dataUser.perfil;
    let params = {
      codigo: myVarGlobals.fReportQuotes,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(params).subscribe((res) => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Reportes de cotizaciones");
        this.vmButtons = [];
        this.guardarolT = [];
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.getClientes();
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getClientes() {
    this.reportInvoice.getClients().subscribe((res) => {
      this.clientes = res["data"];
      this.getVendedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getVendedores() {
    this.reportInvoice.getVendedor().subscribe((res) => {
      this.vendedores = res["data"];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getimpuestos() {
    this.reportInvoice.getImpuestos().subscribe(res => {
      this.getDataTable();
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDataTable() {
    let data = {
      dateFrom: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      dateTo: moment(this.toDatePicker).format("YYYY-MM-DD"),
      id_cliente: this.cliente == 0 ? null : this.cliente,
      id_vendedor: this.vendedor == 0 ? null : this.vendedor,
      pago: this.formaPagofull == 0 ? null : this.formaPagofull,
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      responsive: true,
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      },
      fixedHeader: {
        header: true,
        footer: true
      },
      buttons: [
        {
          extend: "csv",
          footer: true,
          title: "cotización",
          filename: "cotización",
          charset: 'UTF-8',
          bom: true,
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6 ]
          }
        },
        {
          extend: "print",
          footer: true,
          title: "cotización",
          filename: "cotización",
          customize: function (win) {
            $(win.document.body).find('td').addClass('centrard text-left');
            $(win.document.body).find('tbody').css('font-size', '12px');
          },
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6 ]
          }
        },
        {
          extend: "pdf",
          footer: true,
          title: "cotización",
          filename: "cotización",
          customize: function (doc) {
            doc.defaultStyle.fontSize = 9,
              doc.defaultStyle.alignment = 'center',
              doc.styles.title = {
                color: '#404a63',
                fontSize: '14',
                alignment: 'center',
                bold: true,
              },//title
              doc.styles.tableHeader = {
                fillColor: '#404a63',
                color: 'white',
                fontSize: '11',
                alignment: 'center',
                bold: true,
              }//para cambiar el background del escabezado
          },
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6 ]
          }
        },
      ],
    };
    this.reportInvoice.showserchReports(data).subscribe(res => {
      this.validaDtUser = true;
      this.processing = true;
      this.guardarolT = res["data"];
      var total = 0;
      var iva = 0;
      var subTotal = 0;
      var utilidades = 0;
      for (let i = 0; i < this.guardarolT.length; i++) {
        subTotal += parseFloat(this.guardarolT[i]["subtotal"]);
        iva += parseFloat(this.guardarolT[i]["iva"]);
        total += parseFloat(this.guardarolT[i]["total"]);
        /* utilidades += parseFloat(this.guardarolT[i]["rentabilidad_total"]); */
      }

      this.dataTotal.total = total;
      this.dataTotal.subTotal = subTotal;
      this.dataTotal.iva = iva;
      this.dataTotal.utilidad = utilidades;

      if (this.guardarolT.length == 0) {
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
      this.validaDtUser = true;
      this.guardarolT = [];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
      case "EXCEL":
        $('#tableReportVentas').DataTable().button('.buttons-csv').trigger();
        break;
      case "PDF":
        $('#tableReportVentas').DataTable().button('.buttons-pdf').trigger();
        break;
      case "IMPRIMIR":
        $('#tableReportVentas').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

  closeModal() {
    ($("#modalReportDetalle") as any).modal("hide"); //linea para cerrar el modal de boostrap
  }

  searchCliente(event) {
    if (this.cliente != 0) {
      this.cliente = event;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  searchVendedor(event) {
    if (this.vendedor != 0) {
      this.vendedor = event;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  searchPago(event) {
    if (this.formaPagofull != 0) {
      this.formaPagofull = event;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  rerender(): void {
    this.validaDtUser = true;
    this.lcargando.ctlSpinner(true);
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getDataTable();
    });
  }

  informacionSearch(dt) {
    this.documentoDetalle = dt;
    this.secuenceDet = this.documentoDetalle.secuence.toString().padStart(10, '0');
    this.lcargando.ctlSpinner(true);
    this.reportInvoice.ReportsDetalle({ id_quote: dt.id }).subscribe((res) => {
      this.detalleClick = res["data"];
      this.lcargando.ctlSpinner(false);
      $('#modalReportDetalle').appendTo("body").modal('show');
    });
  }

  informaciondtlimpiar() {
    this.rerender();
    this.fromDatePicker = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    this.toDatePicker = new Date();
    this.cliente = 0;
    this.vendedor = 0;
    this.formaPagofull = 0;
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }

  exportPDF(dt, idx) {
    this.print_cdi = {};
    this.print_cdi = dt;
    this.lcargando.ctlSpinner(true);
    this.reportInvoice.ReportsDetalle({ id_quote: dt.id }).subscribe((res) => {
      this.print_cdi['list_product'] = res["data"];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.PrintSectionCDI();
      }, 100);
    });
  }

  PrintSectionCDI() {
    let el: HTMLElement = this.printCDI.nativeElement as HTMLElement;
    el.click();
  }

}
