import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { ReportsService } from './reports.service'
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { environment } from '../../../../../environments/environment';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
declare const $: any;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ShowDevolutionComponent } from './show-devolution/show-devolution.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnDestroy, OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  processing: boolean = false;
  dataUser: any;
  permissions: any;

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

  uri: string = environment.baseUrl;
  quotes: Array<any> = [];
  processingQuotes: boolean = false;
  flag: number = 0;

  last_status: any = null;
  document: any;
  vmButtons: any;

  typeDocs: Array<any> = [
    { id: 1, name: "Cotización" },
    { id: 2, name: "Facturación" },
    { id: 3, name: "Devoluciones" },
  ];
  docFilter: any;
  payloadDeleted: any;
  descriptionDeleted: any;

  constructor(private toastr: ToastrService, private router: Router, private reportSrv: ReportsService,
    private commonServices: CommonService, private commonVarSrv: CommonVarService, private modalService: NgbModal) {

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.validatePermission();
    this.docFilter = "Cotización";
    this.selectDocument();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        $('#tablaAprobaciones').DataTable().button('.buttons-excel').trigger();
        break;
      case "PDF":
        $('#tablaAprobaciones').DataTable().button('.buttons-pdf').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaAprobaciones').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

  /* call apis */
  getReportQuotes() {
    const data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      type_report: this.docFilter,
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      responsive: true,
      buttons: [
        {
          extend: 'excel',
          footer: true,
          title: 'Reporte',
          filename: 'reportes',
        }, {
          extend: 'print',
          footer: true,
          title: 'Reporte',
          filename: 'report print',
        }, {
          extend: "pdf",
          footer: true,
          title: "Reporte",
          filename: "Reporte",
        }
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let prefict = (this.docFilter == "Cotización") ? this.dataUser.permisos_doc.filter(e => e.fk_documento == 6) : this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    let filter = prefict[0]['filtros'].split(',')[0];
    let users = (this.docFilter == "Cotización") ? this.commonServices.filterUserNotification(filter, 6) : this.commonServices.filterUserNotification(filter, 2)

    if (users.find(el => el === this.dataUser["id_usuario"]) !== undefined) {
      this.reportSrv.getAllReportQuotes(data)
        .subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.processingQuotes = true;
          this.quotes = res['data'];
          if (this.quotes.length == 0) {
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = true;
            this.vmButtons[2].habilitar = true;
          } else {
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          }
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.quotes = [];
          this.processingQuotes = true;
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
        });
    } else {
      this.reportSrv.getReportQuotes(data)
        .subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.processingQuotes = true;
          this.quotes = res['data'];
          if (this.quotes.length == 0) {
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = true;
            this.vmButtons[2].habilitar = true;
          } else {
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          }
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.quotes = [];
          this.processingQuotes = true;
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
        });
    }
  }

  getReportQuotesAux() {
    const data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      type_report: this.docFilter,
    }

    this.quotes = [];

    this.vmButtons = [
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsAprobaciones", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      dom: 'frtip',
      buttons: [
        {
          extend: 'excel',
          footer: true,
          title: 'Reporte',
          filename: 'reportes',
        }, {
          extend: 'print',
          footer: true,
          title: 'Reporte',
          filename: 'report print',
        }, {
          extend: "pdf",
          footer: true,
          title: "Reporte",
          filename: "Reporte",
        }
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let prefict = (this.docFilter == "Cotización") ? this.dataUser.permisos_doc.filter(e => e.fk_documento == 6) : this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    let filter = prefict[0]['filtros'].split(',')[0];
    let users = (this.docFilter == "Cotización") ? this.commonServices.filterUserNotification(filter, 6) : this.commonServices.filterUserNotification(filter, 2)

    if (users.find(el => el === this.dataUser["id_usuario"]) !== undefined) {

      this.reportSrv.getAllReportQuotes(data)
        .subscribe(res => {
          this.processingQuotes = true;
          this.processing = true;
          this.quotes = res['data'];

          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
          this.toastr.info(error.error.message);
        });
    } else {
      this.reportSrv.getReportQuotes(data)
        .subscribe(res => {
          this.processingQuotes = true;
          this.processing = true;
          this.quotes = res['data'];
          if (this.quotes.length == 0) {
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = true;
            this.vmButtons[2].habilitar = true;
          } else {
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          }
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
        });
    }
  }

  deleteFileQuotes(data) {
    this.reportSrv.DeleteQuote(data)
      .subscribe(res => {
      }, error => {
      });
  }

  setStatusQuote(data) {
    this.lcargando.ctlSpinner(true);
    this.reportSrv.upgradeQuoteStatus(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res['message']);
        this.rerender();
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  setStatusFact(data) {
    this.lcargando.ctlSpinner(true);
    this.reportSrv.upgradeFactStatus(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res['message']);
        this.rerender();
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  setDocumentAprobated(data) {
    this.lcargando.ctlSpinner(true);
    this.reportSrv.setAprobatedDoc(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res["message"]);
        this.rerender();
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  setDocumentCancel(data) {
    this.lcargando.ctlSpinner(true);
    this.reportSrv.setCancelDoc(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res['message']);
        this.rerender();
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  /* actions */
  previewQuote(idx, action) {
    const payload_prod = [];
    const products = {
      grupo: this.quotes[idx]["client"]['group']['name'],
      tipo_contribuyente: this.quotes[idx]["client"]['contribuyente'],
      id_quote: this.quotes[idx]["id"],
      toDatePicker: this.quotes[idx]["created_at"],
      customerSelect: this.quotes[idx]["fk_client"],
      status_doc: this.quotes[idx]["status"],
      filter_doc: this.quotes[idx]["filter_doc"],
      secuence: this.quotes[idx]["secuence"],
      customer: {
        id_cliente: this.quotes[idx]["client"]["id_cliente"],
        razon_social: this.quotes[idx]["client"]["razon_social"],
        tipo_documento: this.quotes[idx]["client"]["tipo_documento"],
        num_documento: this.quotes[idx]["client"]["num_documento"],
        tipo_contribuyente: this.quotes[idx]["client"]["tipo_contribuyente"],
        cupo_credito: this.quotes[idx]["client"]["cupo_credito"],
        saldo_credito: this.quotes[idx]["client"]["saldo_credito"],
        grupo: this.quotes[idx]["client"]["grupo"],
        formaPagoSelect: this.quotes[idx]["type_payment"],
        asesor: this.quotes[idx]["asesor"],
        observationBuy: (this.quotes[idx]["description"] !== null) ? this.quotes[idx]["description"] : "",
        provincia: this.quotes[idx]["client"]["provincia"],
        ciudad: this.quotes[idx]["client"]["ciudad"],
        direccion: this.quotes[idx]["client"]["direccion"],
        telefono: this.quotes[idx]["client"]["telefono"],
        customerSelect: this.quotes[idx]["fk_client"],
      },
      calculate: {
        subTotalPagado: parseFloat(this.quotes[idx]["subtotal"]),
        ivaPagado: parseFloat(this.quotes[idx]["iva"]),
        totalPagado: parseFloat(this.quotes[idx]["total"]),
        ivaBase: 0.00,
        iva0: 0.00,
      }
    };
    this.quotes[idx]['quotesdetails'].forEach(el => {
      const tmp = {
        PVP: el.product["PVP"],
        nombre: el.nombre,
        codigoProducto: el.codigo,
        marca: (el.marca !== null) ? el.marca : "",
        stock: el.product["stock"],
        quantity: el.cantidad,
        price: el.precio_unitario,
        totalItems: parseFloat(el.total),
        Iva: el.product["Iva"],
        id_producto: el.fk_product,
        action: true,
        price_max: el.product["alert"]["price_max"],
        price_min: el.product["alert"]["price_min"]
      }
      payload_prod.push(tmp);
      if (el.product["Iva"] == 1) {
        products.calculate["ivaBase"] += el.precio_unitario;
      } else {
        products.calculate["iva0"] += el.precio_unitario;
      }
    });
    products["products"] = payload_prod;
    products["type_action"] = action;

    let users = this.document['usr_notifier'].find(el => (el.filter_id == 1 && el.filter_name == "crear"))["users"];

    if (action === 1 && this.permissions["editar"] === 1) {
      this.router.navigateByUrl('comercializacion/facturacion/maintenance/' + JSON.stringify(products));
    } else if (action === 2 && this.permissions["agregar"] === 1) {
      if (users.find(el => el === this.dataUser["id_usuario"]) !== undefined) {
        this.router.navigateByUrl('comercializacion/facturacion/maintenance/' + JSON.stringify(products));
      } else {
        this.toastr.info("No tiene permiso para duplicar la cotización"); return;
      }
    } else {
      this.toastr.info("No tiene permiso para editar/duplicar la cotización"); return;
    }
  }

  exportPDF(idx) {
    const info = this.quotes[idx];
    this.lcargando.ctlSpinner(true);
    this.reportSrv.DownloadQuote(info).subscribe(res => {
        let datos: any = {
          storage: `${res["data"]["storage"]}`,
          name: `${res["data"]["name"]}`,
        };

        this.reportSrv.descargar(datos).subscribe((resultado) => {
            this.lcargando.ctlSpinner(false);
            const url = URL.createObjectURL(resultado);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${res["data"]["name"]}`);
            document.body.appendChild(link);
            link.click();
            this.toastr.success("Se ha descargado Autamaticamente");

            let data = {
              storage: res["data"]["storage"],
              name: res["data"]["name"],
            }
            this.deleteFileQuotes(data)
          }, (error) => {
            this.toastr.info(error.message);
            this.lcargando.ctlSpinner(false);
          }
        );

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
  }

  closeModal() {
    ($('#cancelFactureModal') as any).modal('hide');
    this.descriptionDeleted = undefined;
  }

  deleteFacture(idx) {
    $('#cancelFactureModal').appendTo("body").modal('show');
    if (this.permissions.eliminar == 0) {
      this.toastr.info("Usuario no tiene permisos para eliminar el documento");
    } else {
      this.payloadDeleted = this.quotes[idx];
    }
  }

  async validateDelete() {
    if (this.descriptionDeleted == "" || this.descriptionDeleted == undefined) {
      document.getElementById('descriptionDeletedModal').focus();
      this.toastr.info("Ingrese un motivo para eliminar");
    } else {
      let result = await this.validateAccounDispached(this.payloadDeleted).then(res => {
        if (res) {
          this.CallsApi("Seguro desea eliminar el registro?", "DELETE_BUY", this.payloadDeleted);
        } else {
          Swal.fire({
            title: 'Error!!',
            text: "Esta Factura ya tiene productos entregados por lo que no puede ser eliminada!!",
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            $('#cancelFactureModal').modal('hide');
          })
        }
      })
    }
  }

  async validateAccounDispached(info) {
    return new Promise((resolve, reject) => {
      let cantidad_pendiente = parseFloat('0');
      let cantidad_vendida = parseFloat('0');

      info['quotesdetails'].forEach(element => {
        cantidad_pendiente = element['cant_pendiente'];
        cantidad_vendida = element['cantidad'];
      });
      (cantidad_pendiente == cantidad_vendida) ? resolve(true) : resolve(false);
    });
  }

  deleteDocument(data) {
    this.lcargando.ctlSpinner(true);
    let info = {
      id_venta: data.id_venta,
      fk_quotes: data.fk_quotes,
      num_doc: data.doc_auth,
      fk_typ_doc: data.fk_typ_doc,
      filter_doc: data.filter_doc,
      observation: this.descriptionDeleted,
      dispached: data.dispatched,
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación de factura por el usuario ${this.dataUser['nombre']}: ` + this.descriptionDeleted,
      id_controlador: myVarGlobals.fReportes
    }

    this.reportSrv.deleteFacBuy(info).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.rerender();
      this.closeModal();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* validate permissions by windows */
  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fReportes,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Reportes");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getReportQuotes();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  nexStatus(dt) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
      this.router.navigateByUrl('dashboard');
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, 6);
      if (permission) {
        dt["last_status"] = this.last_status;
        dt["id_user_aprobated"] = this.dataUser["id_usuario"];
        dt["name_user_aprobated"] = this.dataUser["nombre"];
        this.CallsApi("Seguro desea aprobar la cotización?", "MOD_STATUS_COT", dt);
      } else {
        this.toastr.info("Usuario no tiene permisos para aprobar la cotización");
      }
    }
  }

  nexStatusFacture(dt) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
      this.router.navigateByUrl('dashboard');
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, 2);
      if (permission) {
        dt["last_status"] = this.last_status;
        dt["id_user_aprobated"] = this.dataUser["id_usuario"];
        dt["name_user_aprobated"] = this.dataUser["nombre"];
        this.CallsApi("Seguro desea aprobar la factura de venta?", "MOD_STATUS_FAV", dt);
      } else {
        this.toastr.info("Usuario no tiene permisos para aprobar la factura");
      }
    }
  }

  nexStatusDoc(dt, doc) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
      this.router.navigateByUrl('dashboard');
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, doc);
      if (permission) {

        let data = {
          iva_pro_actual: 12,
          id_venta: dt["id_venta"],
          id_venta_factura: dt["id_venta_factura"],
          num_doc: dt["doc_auth"],
          last_status: this.last_status,
          id_user_aprobated: this.dataUser["id_usuario"],
          name_user_aprobated: this.dataUser["nombre"],
          ip: this.commonServices.getIpAddress(),
          accion: `Aprobación de Devolución por el usuario ${this.dataUser['nombre']}: `,
          id_controlador: myVarGlobals.fReportes,
          detalle: dt.detalle
        }
        this.CallsApi("Seguro desea realizar esta acción?", "MOD_STATUS_DEV", data);
      } else {
        this.toastr.info("Usuario no tiene permisos para aprobar el documento");
      }
    }
  }

  cancelDoc(dt, doc) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
      this.router.navigateByUrl('dashboard');
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, doc);
      if (permission) {
        let data = {
          id_venta: dt["id_venta"],
          id_venta_factura: dt["id_venta_factura"],
          last_status: this.last_status,
          id_usr_cancel: this.dataUser["id_usuario"],
          name_usr_cancel: this.dataUser["nombre"],
          ip: this.commonServices.getIpAddress(),
          accion: `Anulación de Devolución por el usuario ${this.dataUser['nombre']}: `,
          id_controlador: myVarGlobals.fReportes
        }
        this.CallsApiCancel("Seguro desea realizar esta acción?", "CANCEL_DOC", data);
      } else {
        this.toastr.info("Usuario no tiene permisos para cancelar el documento");
      }
    }
  }

  selectDocument() {
    if (this.docFilter === "Cotización") {
      this.document = this.dataUser.permisos_doc.find(e => e.fk_documento == 6);
      let step = this.dataUser.permisos_doc.find(e => e.fk_documento == 6)['filtros'].split(',');
      this.last_status = step[step.length - 1];
    } else if (this.docFilter === "Facturación") {
      this.document = this.dataUser.permisos_doc.find(e => e.fk_documento == 2);
      let step = this.dataUser.permisos_doc.find(e => e.fk_documento == 2)['filtros'].split(',');
      this.last_status = step[step.length - 1];
    } else if (this.docFilter === "Devoluciones") {
      this.document = this.dataUser.permisos_doc.find(e => e.fk_documento == 25);
      let step = this.dataUser.permisos_doc.find(e => e.fk_documento == 25)['filtros'].split(',');
      this.last_status = step[step.length - 1];
    }
  }

  /*  Calls API */
  async CallsApi(message, action, payload?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "MOD_STATUS_COT") {
          this.setStatusQuote(payload);
        } else if (action == "MOD_STATUS_FAV") {
          this.setStatusFact(payload);
        } else if (action === "DELETE_BUY") {
          this.deleteDocument(payload);
        } else if (action === "MOD_STATUS_DEV") {
          this.setDocumentAprobated(payload);
        }
      }
    })
  }

  async CallsApiCancel(message, action, payload?: any) {
    Swal.fire({
      text: message,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      preConfirm: (informacion) => {
        if (action == "CANCEL_DOC") {
          payload['motivo'] = informacion
          this.setDocumentCancel(payload);
        }
      },
    })
  }

  /* onChange Methods */
  reportsChange(evt) {
    this.docFilter = evt;
    this.selectDocument();
    this.rerender();
  }

  /* datatable actions */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.processingQuotes = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getReportQuotes();
    });
  }

  showDevolucion(idx, params) {
    if (this.permissions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      const modalInvoice = this.modalService.open(ShowDevolutionComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.info = params;
    }
  }
}
