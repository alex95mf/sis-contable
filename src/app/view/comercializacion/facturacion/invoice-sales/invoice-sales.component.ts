import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { InvoiceService } from './invoice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInvoicesProductComponent } from './modal-invoices-product/modal-invoices-product.component';
import { DiferedComponent } from './difered/difered.component';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-invoice-sales',
  templateUrl: './invoice-sales.component.html',
  styleUrls: ['./invoice-sales.component.scss']
})
export class InvoiceSalesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  permissions: any;
  processing: boolean = false;
  toDatePicker: Date = new Date();
  dateConverter: any;
  dataUser: any;
  flagBtnDired: any = false;
  arrayCustomer: any = [];
  arrayCustomerAux: any;
  ///customer: any = { asesor: { nombre: null }, customerSelect: 0 };
  customer: any = { asesor: { nombre: null }, customerSelect: 0, group: { name: null } };
  dataBuy: any = { activoFijo: false, idTipDocSelect: 0, tipoPagoSelect: 0, formaPagoSelect: 0 };
  valueLethers: any = "0 Dólares con 0 centavos";
  ivaConverter: any;
  validChange: any = false;
  dataDifered: any = null;
  customerSelect: any = 0;
  latestStatus: any;
  prefict: any;
  quote: any;
  num_aut: any = "N/A";
  num_fac: any = "N/A";
  num_serial: any;
  num_point_emision: any;
  validate_cupo: any = false;

  /*actions*/
  actions: any = { dComponet: false };

  /*data totales*/
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };

  /*detalle compra*/
  dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
  arrayProductos: any;

  /*ver cotizaciones*/
  arrayQuote: any;
  arraDetQuote: any = null;
  dataProductoAux: any = [];
  vmButtons: any;

  /*Maximo de facturas por cliente*/
  maxInvoicesPend: any = 0;
  maxInvoicesXCliente: any = 0;
  textNotification: any = "";
  textNotificationSend = "Notificación: ";


  constructor(
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private invService: InvoiceService,
    private socket: Socket
  ) {
    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true); : this.lcargando.ctlSpinner(false);
    })

    this.commonVarServices.setListProductInvoice.asObservable().subscribe(res => {
      this.dataProducto = [];
      res.forEach(element => {
        if (element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['totalAux'] = parseFloat('0.00').toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      res.forEach(element => {
        if (!element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['totalAux'] = parseFloat('0.00').toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      this.dataProducto = this.dataProducto.sort();
      setTimeout(() => {
        document.getElementById("quantyId").focus();
      }, 200);
    })

    this.commonVarServices.listenDiferedInvoice.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarServices.listenQuotes.asObservable().subscribe(res => {
      this.lcargando.ctlSpinner(true);
      this.quote = res;
      this.actions.dComponet = true;
      let custom = this.arrayCustomer.filter(e => e.id_cliente == res.fk_client)[0];
      this.customerSelect = custom.id_cliente;
      this.getCustomer(custom.id_cliente);
      this.invService.getDetQuotes({ id: res.id }).subscribe(result => {
        this.dataTotales.subTotalPagado = parseFloat(res.subtotal);
        this.dataTotales.ivaPagado = parseFloat(res.iva);
        this.dataTotales.totalPagado = parseFloat(res.total);
        this.dataTotales.ivaBase = parseFloat(res.iva_base);
        this.dataTotales.iva0 = parseFloat(res.iva_cero);
        this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
        this.dataProducto = [];
        result['data'].forEach(element => {
          if (element.action) {
            element['price'] = parseFloat(element['price']).toFixed(4);
            element['quantity'] = parseFloat(element['quantity']).toFixed(4);
            element['totalItems'] = parseFloat(element['totalItems']).toFixed(4);
            element['totalAux'] = parseFloat(element['totalItems']).toFixed(4);
            this.dataProducto.push(element);
          }
        });
        result['data'].forEach(element => {
          if (!element.action) {
            element['price'] = parseFloat(element['price']).toFixed(4);
            element['quantity'] = parseFloat(element['quantity']).toFixed(4);
            element['totalItems'] = parseFloat(element['totalItems']).toFixed(4);
            element['totalAux'] = parseFloat(element['totalItems']).toFixed(4);
            this.dataProducto.push(element);
          }
        });
        this.dataProducto = this.dataProducto.sort();

        this.lcargando.ctlSpinner(false);
      })
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsSales", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsSales", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "COTIZACIONES" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsSales", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.dateConverter = moment(this.toDatePicker).format('YYYY-MM-DD');
    this.validatePermission();
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }

    let params = {
      codigo: myVarGlobals.fFacturaVenta,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ventas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCatalogos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getCatalogos() {
    let data = {
      params: "'TIPO PAGO','FORMA PAGO','TIPO COMPRA' "
    }
    this.invService.getCatalogos(data).subscribe(res => {
      this.dataBuy.tipo_pago = res['data']['TIPO PAGO'];
      this.dataBuy.forma_pago = res['data']['FORMA PAGO'];
      this.getCustomers();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCustomers() {
    this.invService.getCustomers().subscribe(res => {
      this.arrayCustomer = res['data'];
      this.arrayCustomerAux = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.invService.getImpuestos().subscribe(res => {
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypeDocument() {
    let data = {
      params: "'V'"
    }
    this.invService.getTypeDocument(data).subscribe(res => {
      this.dataBuy.tip_doc = res['data']['V'];
      this.getNumautNumFac(this.dataBuy.tip_doc[0].id);
      this.dataBuy.idTipDocSelect = this.dataBuy.tip_doc[0].id;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getNumautNumFac(id) {
    if (this.dataTotales.totalPagado > 0) {
      this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
      this.dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
    }
    let data = {
      id: id
    }
    this.lcargando.ctlSpinner(true);
    this.invService.getNumautNumFac(data).subscribe(res => {
      this.num_point_emision = res['data'][0]['num_punto_emision'];
      this.num_serial = res['data'][0]['num_fact_serial'];
      this.num_aut = res['data'][0]['num_autorizacion'];
      this.num_fac = `${res['data'][0]['num_establecimiento']}-${res['data'][0]['num_punto_emision']}-${res['data'][0]['num_fact_serial'].toString().padStart(9, '0')}`;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayCustomer.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.substring(0, dat.length) == dat.toString());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 100);
  }

  getCustomer(e) {
    this.textNotification = "";
    this.maxInvoicesPend = 0;
    this.maxInvoicesXCliente = 0;
    this.customer = this.arrayCustomer.filter(evt => evt.id_cliente == e)[0];
    this.maxInvoicesXCliente = this.customer.plazo_credito;
    this.lcargando.ctlSpinner(true);
    this.invService.validateInvoicePend({ id_cliente: this.customer.id_cliente }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.maxInvoicesPend = res['data'].length;
      if ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) {
        this.textNotification = "Cliente ha superado el máximo de facturas de crédito. ";
      }
    })
  }

  addProduct() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      localStorage.setItem('dataProductsInvoice', JSON.stringify(this.dataProducto));
      const modalInvoice = this.modalService.open(ModalInvoicesProductComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
      modalInvoice.componentInstance.productQuotes = this.arraDetQuote;
      modalInvoice.componentInstance.userGroup = this.customer.grupo;
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
      this.dataProducto[index]['totalAux'] = parseFloat('0.00').toFixed(4);


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
      this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
    }
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto[index]['totalAux'] = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto[index]['totalAux'] = parseFloat(this.dataProducto[index]['totalAux']).toFixed(4);
    this.dataProducto.forEach(element => {
      if (element.Iva == 1 && (this.dataBuy.idTipDocSelect != 8)) {
        this.dataTotales.subTotalPagado += element.totalItems;
        this.dataTotales.ivaBase += element.totalItems;
      } else {
        this.dataTotales.iva0 += element.totalItems;
      }
    });
    this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
    this.dataTotales.subTotalPagado += this.dataTotales.iva0;
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;
    this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
  }

  changeDisabledBtn() {
    if (this.dataBuy.tipoPagoSelect == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = this.dataTotales.totalPagado;
  }

  cancelSales() {
    this.customer.observationSales = "";
    this.maxInvoicesPend = 0;
    this.maxInvoicesXCliente = 0;
    this.validate_cupo = false;
    localStorage.removeItem('dataProductsInvoice');
    this.quote = undefined;
    this.actions.dComponet = false;
    this.arraDetQuote = null;
    this.flagBtnDired = false;
    this.dataDifered = null;
    this.customer = { asesor: { nombre: null }, customerSelect: 0, group: { name: null } };
    this.customerSelect = 0;
    this.dataBuy.idTipDocSelect = 0;
    this.dataBuy.tipoPagoSelect = 0;
    this.dataBuy.formaPagoSelect = 0;
    this.valueLethers = "0 DÓLARES con 0 CENTAVOS";
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
    this.getTypeDocument();
  }

  searchQuotes() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
      modalInvoice.componentInstance.title = "COTIZACIONES";
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fFacturaVenta;
    }
  }

  async validateSaveSales() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2/* == 5 */);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 2/* 5 */)) {
            if ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) {
              Swal.fire({
                text: 'Cliente ha superado el máximo de facturas de crédito, la factura podrá ser creada pero necesitará aprobación ¿desea continuar?',
                showDenyButton: true,
                confirmButtonText: `Continuar`,
                denyButtonText: `Cancelar`,
              }).then((result) => {
                if (result.isConfirmed) {
                  this.confirmSave("Seguro desea continuar?", "SAVE_SALES");
                } else if (result.isDenied) {
                }
              })
            } else {
              this.confirmSave("Seguro desea continuar?", "SAVE_SALES");
            }
          } else {
            this.cancelSales();
            this.toastr.info("Usuario no tiene permiso para crear una Factura o los permisos aún no han sido asignados");
          }
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.customerSelect == 0) {
        this.toastr.info("seleccione un cliente");
        document.getElementById("IdRolesUsersDoc").focus(); return;
      } else if (this.customer.credito == 0 && this.dataBuy.tipoPagoSelect == 'Crédito') {
        Swal.fire({
          title: 'Error!!',
          text: "Cliente no tiene crédito!!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
        return;
      } else if (this.dataBuy.tipoPagoSelect == 0) {
        this.toastr.info("Seleccione un tipo de pago");
      } else if (this.dataBuy.formaPagoSelect == 0) {
        this.toastr.info("Seleccione una forma de pago");
      } else if (this.dataDifered != null && (this.dataTotales.totalPagado.toFixed(2) != this.dataDifered.amount.toFixed(2))
        && this.dataBuy.tipoPagoSelect == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.dataBuy.tipoPagoSelect == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.dataBuy.idTipDocSelect == 0) {
        this.toastr.info("Debe seleccionar un tipo de documento");
        document.getElementById("idTipDocSelect").focus(); return;
      } else if (this.dataProducto[0].codigoProducto == null && this.dataProducto.length == 1) {
        this.toastr.info("Ingrese al menos un producto");
      } else if (this.dataBuy.tipoPagoSelect == 'Crédito' && (this.dataTotales.totalPagado > this.customer.saldo_credito)) {
        Swal.fire({
          text: `Cliente ${this.customer.razon_social} no tiene suficiente cupo para el crédito, ¿desea continuar?`,
          showDenyButton: true,
          confirmButtonText: `Continuar`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.validate_cupo = true;
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
          } else if (result.isDenied) {
          }
        })
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
        if (action == "SAVE_SALES") {
          this.saveSales();
        }
      }
    })
  }

  async saveSales() {
    let notify = `Se ha generado una nueva factura de venta por el usuario ${this.dataUser.nombre}`;
    let productSend = [];
    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });

    for (let index = 0; index < productSend.length; index++) {
      if (productSend[index].quantity <= 0) {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price <= 0) {
        this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); return;
      }
    }

    let info;
    if (this.dataBuy.tipoPagoSelect == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.dataTotales.totalPagado.toFixed(4);
      objCoutas['fecha_vencimiento'] = moment(this.toDatePicker).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.dataTotales.totalPagado.toFixed(4),
        cuotas: 1,
        difered: arrCoutas
      }
    }

    let validate = await this.validateStock(productSend).then(resultado => {
      if (resultado) {
        Swal.fire({
          text: 'Hay uno o varios productos con stock menor a la cantidad solicitada, ¿desea guardar la factura?',
          showDenyButton: true,
          confirmButtonText: `Guardar factura`,
          denyButtonText: `Revisar productos`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.save(productSend, notify, filter, prefict, info, resultado);
          } else if (result.isDenied) {
          }
        })
      } else {
        this.save(productSend, notify, filter, prefict, info, resultado);
      }
    })
  }

  async save(productSend, notify, filter, prefict, info, resultado) {
    this.lcargando.ctlSpinner(true);
    let res = await this.validatePrice(productSend).then(res => {
      localStorage.removeItem('dataProductsInvoice');
      this.textNotificationSend = ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) ? this.textNotificationSend + this.textNotification : this.textNotificationSend + "";
      this.textNotificationSend = (resultado) ? this.textNotificationSend + " Existen uno o varios productos con stock menor a la cantidad solicitada. " : this.textNotificationSend + "";
      this.textNotificationSend = (res) ? this.textNotificationSend + " Existen inconcistencia en los precios. " : this.textNotificationSend + "";
      this.textNotificationSend = (this.validate_cupo) ? this.textNotificationSend + ` Cliente ${this.customer.razon_social} no tiene suficiente cupo para el crédito ` : this.textNotificationSend + "";

      let data = {
        customer: this.customer,
        date: moment(this.toDatePicker).format('YYYY-MM-DD'),
        list_product: productSend,
        totals: this.dataTotales,
        payment_type: this.dataBuy.tipoPagoSelect,
        payment_method: this.dataBuy.formaPagoSelect,
        observation_sales: this.customer.observationSales,
        status: (res) ? "En proceso" : "Aprobado",
        id_user: this.dataUser.id_usuario,
        tip_doc: this.dataBuy.idTipDocSelect,
        ip: this.commonServices.getIpAddress(),
        accion: `Creación de nueva facura por parte del vendedor ${this.customer['asesor']['nombre']}`,
        id_controlador: myVarGlobals.fFacturaVenta,
        notifycation: (!res && !resultado && !this.validate_cupo && !((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? notify : `${notify}, esta factura necesita ser aprobada`,
        abbr_doc: prefict[0].codigo,
        id_document: prefict[0].fk_documento,
        filter_doc: (res || resultado || this.validate_cupo || ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? filter : this.latestStatus,
        usersFilter: this.commonServices.filterUserNotification(filter, 2),
        id_us_aprob: null,
        name_us_aprob: null,
        sendNotification: res,
        type_difered: (this.dataBuy.tipoPagoSelect == "Contado") ? info : this.dataDifered,
        identifyQuotes: (this.quote != undefined) ? true : false,
        id_quotes: (this.quote != undefined) ? this.quote.id : null,
        iva_porcentaje: this.ivaConverter,
        num_autorizacion: this.num_aut,
        num_factura: this.num_fac,
        num_serial: this.num_serial,
        point_emision: this.num_point_emision,
        status_venta: 0,
        rentabilidad: 0.00,
        pagada: 0,
        mot_notif_aprob: this.textNotificationSend
      }
      /* console.log(data); */
      this.invService.saveSales(data).subscribe(result => {
        this.toastr.success(result['message']);
        this.lcargando.ctlSpinner(false);
        if (res || resultado || this.validate_cupo || ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) {
          this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 2));
          Swal.fire({
            title: 'Proceso exitoso!!',
            text: `Será reridigido al proceso de aprobaciones en caso de que necesite ser aprobada esta factura`,
            icon: 'success',
            confirmButtonColor: '#4DBD74',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            this.router.navigateByUrl('comercializacion/facturacion/aprobaciones');
          })
        } else {
          this.cancelSales();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    })
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

  async validateStock(product) {
    let stock = false;
    product.forEach(element => {
      if (element.quantity > (element['stock'] - element.cantidad_reservada) && element['clase'] == "Productos") {
        stock = true;
      }
    });
    return stock;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveSales();
        break;
      case "COTIZACIONES":
        this.searchQuotes();
        break;
      case "CANCELAR":
        this.cancelSales();
        break;
    }
  }

}
