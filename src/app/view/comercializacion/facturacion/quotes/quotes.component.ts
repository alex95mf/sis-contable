import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { QuotesService } from './quotes.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductComponent } from './modal-product/modal-product.component'
import moment from 'moment';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('printCDI') printCDI: ElementRef;

  dataUser: any;
  permissions: any;
  processing: boolean = false;
  toDatePicker: Date = new Date();
  ivaConverter: any;
  flagTable: any = false;
  latestStatus: any;
  prefict: any;
  print_cdi: any;

  /*actions*/
  actions: any = { dComponet: true, btnGuardar: true, btncancelar: true };

  /*customer*/
  customer: any = { asesor: { nombre: "" }, customerSelect: 0, formaPagoSelect: 0, group: { name: "" } };
  arrayCustomerAux: any = [];
  arrayCustomer: any = [];
  arrayFormaPago: any = [];
  customerSelect: any = 0;

  /*productos*/
  dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, quantity: null, price: null, totalItems: 0.00, Iva: 0, action: true }];
  /*totales*/
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  grupo: any;
  validateIdCliente: any = false;
  dPrPromocion: any = false;
  processingtwo: boolean = false;
  vmButtons: any;

  textNotification: any;

  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  dateNow: any;


  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private customerServices: QuotesService,
    private modalService: NgbModal,
    private commonVarServices: CommonVarService,
    private socket: Socket
  ) {
    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarServices.setListProduct.asObservable().subscribe(res => {
      this.lcargando.ctlSpinner(true);
      this.dataProducto = [];
      res.forEach(element => {
        if (element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      res.forEach(element => {
        if (!element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      this.dataProducto = this.dataProducto.sort();
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        document.getElementById("quantyId").focus();
      }, 200);
    })
  }

  ngOnInit(): void {
    this.dateNow = moment(this.hoy).format('YYYY-MM-DD');
    this.vmButtons = [
      //{ orig: "btnsQuotes", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsQuotes", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsQuotes", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsQuotes", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.validatePermission();
    }, 50);
  }

  validatePermission() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 6);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }

    let params = {
      codigo: myVarGlobals.fCotizaciones,
      id_rol: this.dataUser.id_rol
    }
    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cotizaciones");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCatalogos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getCatalogos() {
    let data = {
      params: "'FORMA PAGO'"
    }
    this.customerServices.getCatalogos(data).subscribe(res => {
      this.arrayFormaPago = res['data']['FORMA PAGO'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getimpuestos() {
    this.customerServices.getImpuestos().subscribe(res => {
      this.getCustomers();
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCustomers() {
    this.customerServices.getCustomers().subscribe(res => {
      this.arrayCustomer = res['data'];
      this.arrayCustomerAux = res['data'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayCustomer.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.toLowerCase().substring(0, dat.length) == dat.toLowerCase().toString());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 200);
  }

  getCustomer(e) {
    if (e != 0) {
      this.customer = this.arrayCustomer.filter(evt => evt.id_cliente == e)[0];
      this.validateIdCliente = true;
      this.grupo = parseInt(this.customer.grupo);
      setTimeout(() => {
        this.customer.formaPagoSelect = 0;
      }, 300);
    } else {
      this.customer = { asesor: { nombre: "" }, customerSelect: 0, formaPagoSelect: 0, group: { name: "" } };
    }
  }

  ActivateForm() {
    this.actions.dComponet = true;
    this.actions.btnGuardar = true;
    this.actions.btncancelar = true;
  }

  CancelForm() {
    this.toDatePicker = new Date();
    this.actions = { dComponet: true, btnGuardar: true, btncancelar: true };
    localStorage.removeItem('dataProducts');
    this.toDatePicker = new Date();
    this.dPrPromocion = false;
    this.customerSelect = 0;
    this.validateIdCliente = false;
    this.customer = { asesor: { nombre: null }, formaPagoSelect: 0, group: { name: null } };
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, quantity: null, price: null, totalItems: 0.00, Iva: 0, action: true }];
  }

  addProduct() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      localStorage.setItem('dataProducts', JSON.stringify(this.dataProducto));
      const modalInvoice = this.modalService.open(ModalProductComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
      modalInvoice.componentInstance.grupo = this.grupo;
      this.dPrPromocion = true;
    }
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
    }
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    this.dataProducto[index].totalItems = parseFloat(this.dataProducto[index].quantity) * parseFloat(this.dataProducto[index].price);
    /* this.dataProducto[index].totalItems = parseFloat(this.dataProducto[index].totalItems.toString()).toFixed(4); */
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

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.customerSelect == 0) {
        this.toastr.info("seleccione un ruc o razón social");
        document.getElementById("IdRolesUsersDoc").focus(); return;
      } if (this.customer.credito == 0 && this.customer.formaPagoSelect == 'Crédito') {
        Swal.fire({
          title: 'Error!!',
          text: "Cliente no tiene crédito!!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
        return;
      }
      else if (this.toDatePicker == undefined || this.toDatePicker == null) {
        this.toastr.info("Seleccione una fecha");
        document.getElementById('idquotes').focus(); return;
      } else if (this.customer.formaPagoSelect == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormPago").focus(); return;
      } else if (this.customer.cotizante == undefined || this.customer.cotizante == "" || this.customer.cotizante == null) {
        this.toastr.info("Ingrese nombre del cotizante");
        document.getElementById("idCotizante").focus(); return;
      } else if (this.dataProducto[0].codigoProducto == null && this.dataProducto.length == 1) {
        this.toastr.info("Ingrese al menos un producto");
      } else {
        for (let index = 0; index < this.dataProducto.length; index++) {
          if (this.dataProducto[index].quantity <= 0 && this.dataProducto[index].action) {
            this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
            flag = true; break;
          } else if (this.dataProducto[index].price <= 0 && this.dataProducto[index].action) {
            this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0");
            flag = true; break;
          }
        }
        (!flag) ? resolve(true) : resolve(false);
      }
    });
  }

  async validaSaveQuotes() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 6);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 6)) {
            this.confirmSave("Seguro desea guardar la cotización?", "SAVE_QUOTES");
          } else {
            this.CancelForm();
            this.toastr.info("Usuario no tiene permiso para crear una cotización");
          }
        }
      })
    }
  }

  async confirmSave(message, action, quotes?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_QUOTES") {
          this.saveQuotes();
        }
      }
    })
  }

  async saveQuotes() {
    this.lcargando.ctlSpinner(true);
    let notify = `Se ha generado una nueva cotización por el usuario ${this.dataUser.nombre}`;
    let productSend = [];
    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 6);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });
    for (let index = 0; index < productSend.length; index++) {
      if (productSend[index].quantity == 0) {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price == 0.00) {
        this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); return;
      }
    }
    this.processing = false;
    let res = await this.validatePrice(productSend).then(res => {
      localStorage.removeItem('dataProducts');
      let data = {
        customer: this.customer,
        date: moment(this.toDatePicker).format('YYYY-MM-DD'),
        list_product: productSend,
        totals: this.dataTotales,
        payment_method: this.customer.formaPagoSelect,
        observation_quotes: this.customer.observationBuy,
        status: (res) ? "En proceso" : "Aprobado",
        id_user: this.dataUser.id_usuario,
        ip: this.commonServices.getIpAddress(),
        accion: `Registro de nueva cotización por parte del vendedor ${this.customer['asesor']['nombre']}`,
        id_controlador: myVarGlobals.fCotizaciones,
        notifycation: (!res) ? notify : `${notify}, con inconsistencia en los precios, esta cotización requiere aprobación`,
        abbr_doc: prefict[0].codigo,
        id_document: prefict[0].fk_documento,
        filter_doc: (res) ? filter : this.latestStatus,
        usersFilter: this.commonServices.filterUserNotification(filter, 6),
        id_us_aprob: null,
        name_us_aprob: null,
        sendNotification: res,
        textNotification: "Inconsistencia en los precios"
      }
      this.print_cdi = data;
      this.print_cdi['secuencia'] = "0";

      this.customerServices.saveQuotes(data).subscribe(result => {
        this.print_cdi['secuencia'] = result['data'][0]['secuence'];
        this.toastr.success(result['message']);
        setTimeout(() => {
          this.PrintSectionCDI();
          this.presentarAlerta(res, filter);
        }, 100);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    })
  }

  PrintSectionCDI() {
    let el: HTMLElement = this.printCDI.nativeElement as HTMLElement;
    el.click();
  }

  presentarAlerta(lRes: any, lFilter?: any) {
    this.lcargando.ctlSpinner(false);
    if (lRes) {
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(lFilter, 6));
      Swal.fire({
        title: 'Proceso exitoso!!',
        text: `Será reridigido al proceso de aprobaciones en caso de que necesite ser aprobada esta cotización`,
        icon: 'success',
        confirmButtonColor: '#4DBD74',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.router.navigateByUrl('comercializacion/facturacion/aprobaciones');
      })
    } else {
      this.CancelForm();
    }
  }

  exportPDF(datoParametros: any, lRes: any, lFilter: any) {
    const info = datoParametros.data[0];
    this.lcargando.ctlSpinner(true);
    this.customerServices.DownloadQuote(info).subscribe(res => {
      let datos: any = {
        storage: `${res["data"]["storage"]}`,
        name: `${res["data"]["name"]}`,
      };
      this.customerServices.descargar(datos).subscribe((resultado) => {
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
        this.deleteFileQuotes(data);
        this.presentarAlerta(lRes, lFilter);
      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
        this.presentarAlerta(lRes, lFilter);
      }
      );
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      this.presentarAlerta(lRes, lFilter);
    });
  }

  deleteFileQuotes(data) {
    this.customerServices.DeleteQuote(data).subscribe(res => {
    }, error => {
    });
  }

  async validatePrice(prod) {
    let sendNotification = false;
    prod.forEach(element => {
      if ((parseFloat(element.price) < parseFloat(element['price_min']) || parseFloat(element.price) > parseFloat(element['price_max']))) {
        sendNotification = true;
      }
    });
    return sendNotification;
  }

  closeModalReport() {
    ($("#modaLCotizaReport") as any).modal("hide");
    this.processingtwo = false;
  }

  ReporteCoizacion() {
    if (this.permissions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Cotizaciones");
    } else {
      $('#modaLCotizaReport').appendTo("body").modal('show');
      this.processingtwo = true;
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.ActivateForm();
        break;
      case "GUARDAR":
        this.validaSaveQuotes();
        break;
      case "REPORTE":
        this.ReporteCoizacion();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
    }
  }

}
