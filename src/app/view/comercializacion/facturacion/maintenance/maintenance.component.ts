import { Component, OnInit,ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import 'sweetalert2/src/sweetalert2.scss';
import * as myVarGlobals from '../../../../global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component'
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from './maintenance.service'
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
@Component({
standalone: false,
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permissions: any;
  processing: boolean = false;
  actions: any = { btnModify: false, btnDuplicate: false, btnCancel: false };

  id_quote: any;
  secuence: any;
  toDatePicker: Date = new Date();
  customer: any = { asesor: { nombre: null }, customerSelect: 0, formaPagoSelect: 0 };
  arrayCustomerAux: any = [];
  arrayCustomer: any = [];
  arrayFormaPago: any = [];
  customerSelect: any;
  docStatus: any;
  ivaConverter: any;
  grupo: any;
  tipo_con: any;

  dataProducto = [
    { nombre: null, codigoProducto: null, marca: null, stock: 0, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }
  ];
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  statusDocuments: any = [
    { id: 1, name: "En Proceso" },
    { id: 2, name: "Perdido" },
    { id: 3, name: "Rechazado" }
  ];
  deletedProduct: Array<any> = [];
  step: any = 0;
  current_status: any = null;
  document: any = null;
  aprobated: any;
  vmButtons: any;

  constructor(private routerparam: ActivatedRoute, private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private maintenanceSrv: MaintenanceService, private commonServices: CommonService, private commonVarSrv: CommonVarService, private socket: Socket) {
    this.commonVarSrv.setListProductEdit.asObservable().subscribe(res => {
      this.dataProducto = [];
      res.forEach(element => {
        if (element.action) {
          this.dataProducto.push(element);
        }
      });
      res.forEach(element => {
        if (!element.action) {
          this.dataProducto.push(element);
        }
      });
      this.dataProducto = this.dataProducto.sort((a, b) => b.price - a.price);
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsQuotesMantenaince", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "DUPLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsQuotesMantenaince", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsQuotesMantenaince", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.validatePermission();
  }

  /* Validations */
  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fReportes,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.editar == "0") {
        this.toastr.info("Usuario no tiene Permiso para editar el reporte");
        this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.getCatalogos()
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if (this.toDatePicker == undefined || this.toDatePicker == null) {
        this.toastr.info("Seleccione una fecha");
        document.getElementById('idquotes').focus(); return;
      } else if (this.customer.formaPagoSelect == undefined || this.customer.formaPagoSelect == "") {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormPago").focus(); return;
      } else {
        resolve(true);
      }
    });
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SET_QUOTES") {
          this.setQuotes();
        } else if (action == "DUPLICATE_QUOTES") {
          this.duplicateQuotes();
        }
      }
    })
  }

  async validatePrice(prod) {
    let isCorrect = false;
    prod.forEach(element => {
      if (element.price < element['price_min'] || element.price > element['price_max']) {
        isCorrect = true;
        return isCorrect;
      }
    });
    return isCorrect;
  }

  /* Common methods information */
  parseDocument() {
    this.lcargando.ctlSpinner(false);
    this.document = this.dataUser.permisos_doc.find(e => e.fk_documento == 6);
    /*let last_status = this.document["filtros"].split(",");
    if (parseInt(last_status[last_status.length - 1]) !== parseInt(this.current_status)) {
      let users = this.commonServices.filterUserNotification(this.current_status, 6);
      this.aprobated = (users.find(el => el === this.dataUser["id_usuario"]) !== undefined) ? true : false;
    } else {
      this.aprobated = true;
    } */
    let users = this.commonServices.filterUserNotification(this.current_status, 6);
    this.aprobated = (users.find(el => el === this.dataUser["id_usuario"]) !== undefined) ? true : false;
  }

  parseInformation() {

    let params = JSON.parse(this.routerparam.snapshot.params['maintenance'])
    this.id_quote = params["id_quote"];
    this.toDatePicker = params["toDatePicker"];
    this.customer = params["customer"];
    this.customerSelect = params["customerSelect"];
    this.dataTotales = params["calculate"];
    this.dataProducto = params["products"];
    this.docStatus = params["status_doc"];
    this.step = params["type_action"];
    this.current_status = params["filter_doc"];
    this.secuence = params["secuence"];
    this.grupo = params["grupo"];
    this.tipo_con = params["tipo_contribuyente"];

    if (params["type_action"] == 1) {
      /* this.actions.btnDuplicate = false;
      this.actions.btnModify = true; */
      this.vmButtons[0].permiso = false;
      this.vmButtons[0].showimg = false;
      this.vmButtons[1].permiso = true;
      this.vmButtons[1].showimg = true;
    } else if (params["type_action"] == 2) {
      this.current_status = 1;
      /* this.actions.btnModify = false;
      this.actions.btnDuplicate = true; */
      this.vmButtons[0].permiso = true;
      this.vmButtons[0].showimg = true;
      this.vmButtons[1].permiso = false;
      this.vmButtons[1].showimg = false;
      this.docStatus = "En Proceso";
      this.toDatePicker = new Date();
    }
    this.parseDocument();
  }

  addProduct() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      localStorage.setItem('EditProducts', JSON.stringify(this.dataProducto));
      const modalInvoice = this.modalService.open(ModalComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
    }
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      if (element.Iva == 1) {
        this.dataTotales.subTotalPagado += element.totalItems;
        this.dataTotales.ivaBase += element.totalItems;
      } else {
        this.dataTotales.iva0 += element.totalItems;
      }
    });
    this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
    this.dataTotales.subTotalPagado += this.dataTotales.iva0;
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;
  }

  deleteItems(index) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.dataTotales.subTotalPagado = 0.00;
      this.dataTotales.ivaPagado = 0.00;
      this.dataTotales.totalPagado = 0.00;
      this.dataTotales.ivaBase = 0.00;
      this.dataTotales.iva0 = 0.00;
      this.dataProducto[index]['action'] = false;
      this.dataProducto[index]['quantity'] = 0;
      this.dataProducto[index]['price'] = this.dataProducto[index]['PVP'];
      this.dataProducto[index]['totalItems'] = 0.00;

      this.dataProducto.forEach(element => {
        if (element.Iva == 1) {
          this.dataTotales.subTotalPagado += element.totalItems;
          this.dataTotales.ivaBase += element.totalItems;
        } else {
          this.dataTotales.iva0 += element.totalItems;
        }
      });
      this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
      this.dataTotales.subTotalPagado += this.dataTotales.iva0;
      this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;

      this.deletedProduct.push(this.dataProducto[index])
    }
  }

  CancelForm() {
    localStorage.removeItem('EditProducts');
    this.actions = { btnModify: false, btnDuplicate: false, btnCancel: false };
    this.router.navigateByUrl('comercializacion/facturacion/aprobaciones');
  }

  async MaintenanceQuote() {
    if (this.step == 1) {
      this.confirmSave("Seguro desea actualizar la cotización?", "SET_QUOTES");
    } else if (this.step == 2) {
      await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea duplicar la cotización?", "DUPLICATE_QUOTES");
        }
      })
    }
  }

  /* onChange Events */
  getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayCustomer.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.substring(0, dat.length) == dat.toString());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 100);
  }

  getCustomer(e) {
    const pay = this.customer.formaPagoSelect
    const obs = this.customer.observationBuy
    this.customer = this.arrayCustomer.filter(evt => evt.id_cliente == e)[0];
    this.customer.formaPagoSelect = pay;
    this.customer.observationBuy = obs;
  }

  /* Calls API */
  getCatalogos() {
    let data = {
      params: "'FORMA PAGO'"
    }
    this.maintenanceSrv.getCatalogos(data).subscribe(res => {
      this.arrayFormaPago = res['data']['FORMA PAGO'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getimpuestos() {
    this.maintenanceSrv.getImpuestos().subscribe(res => {
      this.getCustomers();
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCustomers() {
    this.maintenanceSrv.getCustomers().subscribe(res => {
      this.arrayCustomer = res['data'];
      this.arrayCustomerAux = res['data'];
      this.parseInformation()
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  async setQuotes() {
    this.lcargando.ctlSpinner(true);
    let productSend = [];
    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });
    for (let index = 0; index < productSend.length; index++) {
      if (productSend[index].quantity  <= 0) {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price  <= 0) {
        this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); return;
      }
    }
    await this.validatePrice(productSend).then(resp => {
      let current_msg = `Se ha actualizado la cotizacion por el usuario ${this.dataUser.nombre}`;
      let data = {
        id_quote: this.id_quote,
        customer: this.customer,
        date: moment(this.toDatePicker).format('YYYY-MM-DD'),
        list_product: productSend,
        totals: this.dataTotales,
        payment_method: this.customer.formaPagoSelect,
        observation_quotes: this.customer.observationBuy,
        status: this.docStatus,
        deleted: this.deletedProduct,
        id_user: this.dataUser.id_usuario,
        ip: this.commonServices.getIpAddress(),
        accion: `Actualización de cotización por parte de ${this.dataUser['nombre']}`,
        id_controlador: myVarGlobals.fCotizaciones,
        secuence: this.secuence,
        /* Notifications */
        sendMessage: resp,
        aprobated: this.aprobated,
        id_document: this.document["fk_documento"],
        filter_doc: this.current_status,
        abbr_doc: this.document["codigo"],
        usersFilter: this.commonServices.filterUserNotification(this.current_status, 6),
        notifycation: (!resp) ? current_msg : `${current_msg}, con inconsistencia en los precios, esta cotización requiere observación y aprobación.`,
      }

      this.maintenanceSrv.setQuotes(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res['message']);
        if (!this.aprobated && resp) {
          this.socket.onEmitNotification(this.commonServices.filterUserNotification(this.current_status, 6));
        }
        localStorage.removeItem('EditProducts');
        this.CancelForm();
      }, error => {
        this.toastr.info(error.error.message);
      })
    });
  }

  async duplicateQuotes() {
    this.lcargando.ctlSpinner(true);
    let productSend = [];
    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });
    for (let index = 0; index < productSend.length; index++) {
      if (productSend[index].quantity  <= 0) {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price  <= 0) {
        this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); return;
      }
    }

    if (productSend.length == 0) {
      this.toastr.info("Ingrese al menos un producto"); return;
    }

    await this.validatePrice(productSend).then(resp => {
      let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 6);
      let filter = prefict[0]['filtros'].split(',');
      filter = filter[0];

      let current_msg = `Se ha duplicado una nueva cotizacion compra por el usuario ${this.dataUser.nombre}`;
      let steps = this.dataUser.permisos_doc.find(e => e.fk_documento == 6)['filtros'].split(',');
      let last_step = steps[steps.length - 1];

      let data = {
        id_quote: this.id_quote,
        customer: this.customer,
        date: moment(this.toDatePicker).format('YYYY-MM-DD'),
        list_product: productSend,
        totals: this.dataTotales,
        payment_method: this.customer.formaPagoSelect,
        observation_quotes: (this.customer.observationBuy != undefined) ? this.customer.observationBuy : "",
        status: (resp) ? this.docStatus : "Aprobado",
        id_user: this.dataUser.id_usuario,
        id_document: prefict[0].fk_documento,
        ip: this.commonServices.getIpAddress(),
        accion: `${current_msg}, perteneciente al asesor ${this.customer['asesor']['nombre']}`,
        id_controlador: myVarGlobals.fCotizaciones,
        /* Notifications */
        sendMessage: resp,
        filter_doc: (resp) ? filter : last_step,
        abbr_doc: prefict[0].codigo,
        usersFilter: this.commonServices.filterUserNotification(filter, 6),
        notifycation: (!resp) ? current_msg : `${current_msg}, con inconsistencia en los precios, esta cotización requiere aprobación.`,
      }

      this.maintenanceSrv.duplicateQuotes(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res['message']);
        localStorage.removeItem('EditProducts');
        if (resp) {
          this.socket.onEmitNotification(this.commonServices.filterUserNotification(this.current_status, 6));
        }
        this.CancelForm();
      }, error => {
        this.toastr.info(error.error.message);
      })
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "DUPLICAR":
        this.MaintenanceQuote();
        break;
      case "MODIFICAR":
        this.MaintenanceQuote();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
    }
  }
}
