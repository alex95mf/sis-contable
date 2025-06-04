import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../../app/services/commonServices';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FacturaCompraService } from './factura-compra.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Socket } from '../../../../services/socket.service';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { DiferidoComponent } from './diferido/diferido.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.scss']
})
export class FacturaCompraComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  toDatePicker: Date = new Date();
  fecha: any = moment(this.toDatePicker).format('YYYY-MM-DD HH:mm:ss');
  ivaConverter: any;
  contador: any = 0;
  validaDtBuy: any = false;
  position: any = false;
  id_order_update: any;
  /*actions*/
  actions: any = { btnNuevo: false, btnGuardar: false, btnMod: false, btncancelar: false, dComponet: false, dUpdate: false };
  /*Compra*/
  dataBuy: any = { activoFijo: false, tipoPagoSelect: 0, formaPagoSelect: 0, estado: "A", userSelect: 0, rucProvider: 0 };
  /*detalle compra*/
  /* dataProducto = [{ productSelect: 0, codigo: "Código", description: null, quantity: 0, price: 0.00, totalItems: 0.00, pagaIva: 0 }]; */
  dataProducto = [{ productSelect: 0, codigo: "Código", description: null, quantity: null, price: null, totalItems: 0.00, pagaIva: 0 }];
  arrayProductos: any;
  /*totales*/
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  /*table buy*/
  dataBuyTable: any;
  prefict: any;
  dataDifered: any = null;
  flagBtnDired: any = false;
  validChange: any = false;
  descriptionDeleteBuy: any;
  varDeleteBuy: any;
  orders: any;
  detailOrder: any;
  identiFyOrders: any = false;
  vmButtons: any;
  /*validateBtnSave */
  btnSave: any = false;
  arrayProveedor: any;
  disestado: any = false;

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private factServ: FacturaCompraService,
    private socket: Socket,
    private commonVarSrvice: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVarSrvice.setPositionBuy.asObservable().subscribe(res => {
      this.position = res;
    })

    this.commonVarSrvice.listenDifered.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarSrvice.listenOrders.asObservable().subscribe(res => {
      this.deleteBuy();
      this.actions.dComponet = true;
      /* this.actions.btnNuevo = true;
      this.actions.btnGuardar = true;
      this.actions.btncancelar = true; */

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[4].habilitar = true;


      this.validChange = true;
      this.orders = res;
      this.factServ.getDetOrders({ id: res.id }).subscribe(res => {
        this.dataProducto = res['data'];
        this.identiFyOrders = true;
        this.dataBuy.userSelect = "";
        this.flagBtnDired = true;
        this.dataBuy.rucProvider = this.orders.num_documento;
        this.dataTotales.ivaPagado = parseFloat(this.orders.iva);
        this.dataTotales.subTotalPagado = parseFloat(this.orders.subtotal);
        this.dataTotales.totalPagado = parseFloat(this.orders.total);
        this.dataProducto.forEach(element => {
          if (element.pagaIva == 1) {
            this.dataTotales.ivaBase += element.totalItems;
          } else {
            this.dataTotales.iva0 += element.totalItems;
          }
        });
      })
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasProLocales", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProLocales", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsComprasProLocales", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsComprasProLocales", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "ORDENES" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsComprasProLocales", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    setTimeout(() => {
      this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 3)[0];
      let id_rol = this.dataUser.id_rol;
      let data = {
        codigo: myVarGlobals.fFacturaCompra,
        id_rol: id_rol
      }
      this.lcargando.ctlSpinner(true);
      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res['data'][0];
        if (this.permisions.ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Factura de comprass");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          (this.permisions.descargar == "0") ? this.actions.btnDescargar = false : this.actions.btnDescargar = true;
          this.getProveedores();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }, 10);
  }

  callSection(data) {
    let id = "#" + data;
    let x = document.querySelector(id);
    if (x) {
      setTimeout(() => {
        x.scrollIntoView();
      }, 150);
    }
  }

  getProveedores() {
    this.factServ.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = {
      params: "'TIPO PAGO','FORMA PAGO','TIPO COMPRA' "
    }
    this.factServ.getCatalogos(data).subscribe(res => {
      this.dataBuy.tipo_pago = res['data']['TIPO PAGO'];
      this.dataBuy.forma_pago = res['data']['FORMA PAGO'];
      //this.dataBuy.tip_doc = res['data']['TIPO COMPRA']; revisar, la comente porque abajo se setea de nuevo en getTypeDocument() 31/08/2021
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getimpuestos() {
    this.factServ.getImpuestos().subscribe(res => {
      this.getUsuario();
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  getUsuario() {
    this.factServ.getUsuario().subscribe(res => {
      this.dataBuy.dataUsuario = res['data'];
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypeDocument() {
    /* let data = {
      params: "'C'"
    } */
    let data = {
      params: "'V'"
    }
    this.factServ.getTypeDocument(data).subscribe(res => {
      this.dataBuy.tip_doc = res['data']['V'];
      this.dataBuy.idTipDocSelect = this.dataBuy.tip_doc[0].id;
      this.getProductos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getProductos() {
    let data = {
      clase: ['Productos', 'Servicios']
    }
    this.factServ.searchProduct(data).subscribe(res => {
      this.arrayProductos = res['data'];
      this.getDataTableBuy();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDataTableBuy() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order: [[ 0, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.lcargando.ctlSpinner(true);
    this.factServ.presentaTablaBuy()
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.validaDtBuy = true;
        this.dataBuyTable = res['data'];
        this.contador += 1;
        if (this.position) {
          setTimeout(() => {
            this.callSection('tudiv');
          }, 500);
        }
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
  }

  getDataProduct(evt, index) {
    let filt = this.arrayProductos.filter(e => e.id_producto == evt);
    filt = filt[0];
    let validt = false;
    this.dataProducto.forEach(element => {
      if (element.codigo == filt.codigoProducto) { validt = true; }
    });
    if (validt) {
      Swal.fire(
        'Atención!',
        'Este producto ya se encuenta en la lista ingresada!',
        'error'
      )
    } else {
      /* this.dataProducto[index].price = filt.PVP; */
      this.dataProducto[index].price = 0.00;
      this.dataProducto[index].codigo = filt.codigoProducto;
      this.dataProducto[index].pagaIva = filt.Iva;
    }
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    /* this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      this.dataTotales.subTotalPagado += element.totalItems;
      if (element.pagaIva == 1) {
        this.dataTotales.ivaBase += element.totalItems;
      } else {
        this.dataTotales.iva0 += element.totalItems;
      }
    });
    this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */
    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      if (element.pagaIva == 1 && this.dataBuy.idTipDocSelect != 8) {
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

  addItems() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = { productSelect: 0, codigo: "Código", description: null, quantity: null, price: null, totalItems: 0.00, pagaIva: 0 };
      //let items = { productSelect: 0, codigo: "Código", description: null, quantity: 0, price: 0.00, totalItems: 0.00, pagaIva: 0 };
      this.dataProducto.push(items);
    }
  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.dataTotales.subTotalPagado = 0.00;
      this.dataTotales.ivaPagado = 0.00;
      this.dataTotales.totalPagado = 0.00;
      this.dataTotales.ivaBase = 0.00;
      this.dataTotales.iva0 = 0.00;

      this.dataProducto.splice(index, 1);
      /* this.dataProducto.forEach(element => {
        this.dataTotales.subTotalPagado += element.totalItems;
        if (element.pagaIva == 1) {
          this.dataTotales.ivaBase += element.totalItems;
        } else {
          this.dataTotales.iva0 += element.totalItems;
        }
      });
      this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
      this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */

      this.dataProducto.forEach(element => {
        if (element.pagaIva == 1) {
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

  deleteBuy() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;

    this.actions.dUpdate = false;
    this.dataProducto = [{ productSelect: 0, codigo: "Código", description: null, quantity: 0, price: 0.00, totalItems: 0.00, pagaIva: 0 }];
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.dataBuy.numAut = "";
    this.dataBuy.numDoc = "";
    this.dataBuy.rucProvider = 0;
    this.dataBuy.tipoPagoSelect = 0;
    this.dataBuy.formaPagoSelect = 0;
    this.dataBuy.userSelect = 0;
    this.dataBuy.estado = "A";
    this.dataBuy.observation = "";
    this.dataBuy.activoFijo = false;
    this.id_order_update = undefined;
    this.flagBtnDired = false;
    this.validChange = false;
    this.identiFyOrders = false;
    this.validaDtBuy = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTypeDocument();
    });
    this.disestado = false;
  }

  newBuy() {
    this.actions.dComponet = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[0].habilitar = true;
    this.id_order_update = undefined;
  }

  async validaSaveBuy() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (!this.dataBuy.activoFijo) {
        let resp = await this.validateDataGlobal().then(respuesta => {
          if (respuesta) {
            this.confirmSave("Seguro desea guardar la factura?", "SAVE_BILL");
          }
        })
      } else {
        this.toastr.info("esta parte falta");
      }
    }
  }

  validateDataGlobal() {
    let flag = false;
    let c = 0;
    return new Promise((resolve, reject) => {
      if (this.dataBuy.numAut == undefined || this.dataBuy.numAut == "") {
        this.toastr.info("Ingrese un número de autorización");
        document.getElementById("idNumFac").focus(); return;
      } else if (this.dataBuy.numDoc == undefined || this.dataBuy.numDoc == "") {
        this.toastr.info("Debe ingresar un número de documento");
        document.getElementById("idNumDoc").focus(); return;
      } else if (this.dataBuy.tipoPagoSelect == undefined || this.dataBuy.tipoPagoSelect == 0) {
        this.toastr.info("Seleccione un tipo de pago");
        document.getElementById("idTipoPagoSelect").focus(); return;
      } else if (this.dataBuy.formaPagoSelect == undefined || this.dataBuy.formaPagoSelect == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormaPago").focus(); return;
      } else if (this.dataBuy.userSelect == undefined || this.dataBuy.userSelect == 0) {
        this.toastr.info("Seleccione el usuario quien recibe");
        document.getElementById("idUserReceibed").focus(); return;
      } else if ((this.dataBuy.rucProvider == undefined || this.dataBuy.rucProvider == 0) && !this.dataBuy.activoFijo) {
        this.toastr.info("Debe seleccionar un Proveedor");
        document.getElementById("idRucProv").focus(); return;
      } else if (this.dataBuy.idTipDocSelect == undefined) {
        this.toastr.info("Debe seleccionar un tipo de documento");
        document.getElementById("idTipDocSelect").focus(); return;
      } else if (this.dataDifered != null && (this.dataTotales.totalPagado.toFixed(4) != this.dataDifered.amount.toFixed(4))
        && this.dataBuy.tipoPagoSelect == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.dataBuy.tipoPagoSelect == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else {
        c = 0;
        for (let index = 0; index < this.dataProducto.length; index++) {
          if (this.dataProducto[index].productSelect == null) {
            c += 1;
            if (c == 1) { this.toastr.info("Falta de seleccionar un producto"); }
            flag = true; return;
          } else if (this.dataProducto[index].quantity == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); }
            flag = true; return;
          } else if (this.dataProducto[index].price == 0.00) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser "); }
            flag = true; return;
          }
        }
        /* if (!flag && !this.dataBuy.activoFijo) {
          let data = {
            ruc: this.dataBuy.rucProvider
          }
          this.factServ.getUsRucExist(data).subscribe(res => {
            if (res['data'].length == 0) {
              this.toastr.info("El ruc no esta registrado, revise el ruc o vaya a la sección de ingreso de proveedores");
              document.getElementById("idRucProv").focus(); return;
            } else {
              if (this.id_order_update == undefined) {
                this.factServ.validateNumDoc({ num_doc: this.dataBuy.numDoc }).subscribe(resp => {
                  if (resp['data'].length > 0) {
                    this.toastr.info("El número de documento ya existe");
                    document.getElementById("idNumDoc").focus(); return;
                  } else {
                    resolve(true);
                  }
                })
              } else {
                resolve(true);
              }
            }
          })
        } else { */
        (!flag) ? resolve(true) : resolve(false);
        /*  } */
      }
    });
  }

  async confirmSave(message, action, buy?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_BILL") {
          this.btnSave = true;
          this.saveBill();
        } else if (action == "UPDATE_BUY") {
          this.saveUpdateBuy();
        } else if (action == "DELETE_BUY") {
          ($('#exampleModal') as any).modal('hide');
          this.delete(buy);
        }
      }
    })
  }

  saveBill() {
    this.lcargando.ctlSpinner(true);
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

    let idProveedor: any = this.arrayProveedor.find(datos => datos.num_documento == this.dataBuy.rucProvider);

    let data = {
      id_empresa: this.dataUser.id_empresa,
      id_user: this.dataUser.id_usuario,
      tip_doc: this.dataBuy.idTipDocSelect,
      num_aut: this.dataBuy.numAut,
      num_doc: this.dataBuy.numDoc.trim(),
      ruc_provider: this.dataBuy.rucProvider,
      tip_buy: this.dataBuy.tipoPagoSelect,
      tip_form: this.dataBuy.formaPagoSelect,
      base_iva: this.dataTotales.ivaBase.toFixed(4),
      base_0: this.dataTotales.iva0.toFixed(4),
      iva_porcentaje: this.ivaConverter,
      iva_value_buy: this.dataTotales.ivaPagado.toFixed(4),
      sub_total: this.dataTotales.subTotalPagado.toFixed(4),
      total: this.dataTotales.totalPagado.toFixed(4),
      user_received: parseInt(this.dataBuy.userSelect),
      list_product: this.dataProducto,
      observation: this.dataBuy.observation,
      act_fijo: (!this.dataBuy.activoFijo) ? 0 : 1,
      ip: this.commonServices.getIpAddress(),
      accion: `creación de Factura por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fFacturaCompra,
      notifycation: `Se ha generado una nueva factura de compra por el usuario ${this.dataUser.nombre}`,
      abbr_doc: this.prefict.codigo,
      id_document: 3,
      usersFilter: [this.dataBuy.userSelect],
      type_difered: (this.dataBuy.tipoPagoSelect == "Contado") ? info : this.dataDifered,
      identifyOrders: (this.identiFyOrders) ? true : false,
      id_orders: (this.orders != undefined) ? this.orders.id : 0,
      idProveedor: idProveedor != undefined ? idProveedor.id_proveedor : null
    }
    //aqui se valida cuando la compra es pra activo fijo o compra a proveedor
    if (!this.dataBuy.activoFijo) {
      this.factServ.saveBuy(data).subscribe(res => {
        this.socket.onEmitNotification([this.dataBuy.userSelect]);
        this.toastr.success(res['message']);
        this.deleteBuy();
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.btnSave = false;
        this.toastr.info(error.error.message);
      })
    } else {
      this.toastr.info("esto falta");
      this.factServ.saveBuy(data).subscribe(res => {
        this.socket.onEmitNotification([this.dataBuy.userSelect]);
        this.toastr.success(res['message']);
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.btnSave = false;
        this.toastr.info(error.error.message);
      })
    }
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferidoComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.dataTotales.totalPagado.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[2].habilitar;
  }

  changeDisabledBtn() {
    if (this.dataBuy.tipoPagoSelect == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  setBuy(dt) {
    this.lcargando.ctlSpinner(true);
    this.disestado = true;
    this.validChange = true;
    this.id_order_update = dt;
    this.actions.dComponet = true;
    this.actions.dUpdate = true;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.identiFyOrders = false;

    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      this.factServ.getDetBuy({ id_compra: dt.id_compra, num_doc: dt.num_documento }).subscribe(res => {

        let objDired = {};
        objDired['amount'] = parseFloat(dt.total);
        objDired['cuotas'] = dt.num_cuotas;
        objDired['difered'] = res['data'].det_cxp;
        this.dataDifered = objDired;
        this.dataProducto = res['data'].det_product;
        this.dataTotales.ivaBase = parseFloat(dt.valor_base_iva);
        this.dataTotales.iva0 = parseFloat(dt.valor_base_cero);
        this.dataTotales.ivaPagado = parseFloat(dt.iva_valor);
        this.dataTotales.subTotalPagado = parseFloat(dt.subtotal);
        this.dataTotales.totalPagado = parseFloat(dt.total);
        this.dataBuy.numAut = dt.autorizacion;
        this.dataBuy.rucProvider = dt.ruc;
        this.dataBuy.numDoc = dt.num_documento;
        this.dataBuy.tipoPagoSelect = dt.tipo_pago;
        this.dataBuy.formaPagoSelect = dt.forma_pago;
        this.dataBuy.idTipDocSelect = dt.fk_tipo_doc;
        this.dataBuy.userSelect = dt.user_received;
        this.dataBuy.observation = dt.observaciones;
        this.dataBuy.activoFijo = (dt.act_fijo == 1) ? true : false;
        this.flagBtnDired = /* true; */(dt.tipo_pago == 'Contado') ? false : true;
        this.lcargando.ctlSpinner(false);
      })
    }
  }

  async validaUpdateBuy() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      if (!this.dataBuy.activoFijo) {
        let resp = await this.validateDataGlobal().then(respuesta => {
          if (respuesta) {
            if (this.dataBuy.tipoPagoSelect == 'Crédito' && this.dataDifered.difered.length == 1) {
              Swal.fire({
                title: "Atención!!",
                text: "Seguro no desea diferir a mas cuotas la factura?",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#DC3545',
                confirmButtonColor: '#13A1EA',
                cancelButtonText: "Diferir",
                confirmButtonText: "Continuar"
              }).then((result) => {
                if (result.value) {
                  this.btnSave = true;
                  this.saveUpdateBuy();
                } else {
                  document.getElementById("idbtndifered").focus(); return;
                }
              })
            } else {
              if (this.dataBuy.tipoPagoSelect == 'Contado' && this.dataDifered.difered.length > 1) {
                this.toastr.info("El número de cuotas no puede ser mayor de 1 cuando la forma de pago es al contado");
                document.getElementById("idbtndifered").focus(); return;
              } else {
                this.confirmSave("Seguro desea actualizar la información?", "UPDATE_BUY");
              }
            }
          }
        })
      } else {
        this.toastr.info("esta parte falta");
      }
    }
  }

  saveUpdateBuy() {
    this.lcargando.ctlSpinner(true);
    let data = {
      id_compra: this.id_order_update.id_compra,
      num_doc: this.id_order_update.num_documento,
      tip_doc_buy: this.id_order_update.fk_tipo_doc
    }
    this.factServ.updateBuy(data).subscribe(res => {
      this.id_order_update = undefined;
      this.saveBill();
    }, error => {
      this.btnSave = false;
      this.toastr.info(error.error.message);
    })
  }

  deleteFacBuy(dt) {
    $('#exampleModal').appendTo("body").modal('show');
    this.varDeleteBuy = dt;
  }

  validateDeleteBuy() {
    if (this.permisions.eliminar == '0') {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (this.descriptionDeleteBuy == "" || this.descriptionDeleteBuy == undefined) {
        document.getElementById('idDesOrderAnulared').focus();
        this.toastr.info("Ingrese un motivo para eliminar ");
      } else {
        this.confirmSave("Seguro desea eliminar el registro?", "DELETE_BUY", this.varDeleteBuy);
      }
    }
  }

  delete(data) {
    this.lcargando.ctlSpinner(true);
    let dt = {
      id_compra: data.id_compra,
      num_doc: data.num_documento,
      tip_doc_buy: data.fk_tipo_doc,
      observation: this.descriptionDeleteBuy,
      ip: this.commonServices.getIpAddress(),
      accion: "Eliminación de factura " + this.descriptionDeleteBuy,
      id_controlador: myVarGlobals.fFacturaCompra,
      id_orden: data.fk_orders
    }
    this.factServ.deleteFacBuy(dt).subscribe(res => {
      this.deleteBuy();
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  searchOrders() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.title = "ORDENES";
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validaSaveBuy();
        break;
      case "MODIFICAR":
        this.validaUpdateBuy();
        break;
      case "ORDENES":
        this.searchOrders();
        break;
      case "CANCELAR":
        this.deleteBuy();
        break;
      case "NUEVO":
        this.newBuy();
        break;
    }
  }

  cancelBuy(evt) {
    if (this.dataTotales.totalPagado > 0) {
      this.dataDifered = null;
      this.dataProducto = [{ productSelect: 0, codigo: "Código", description: null, quantity: 0, price: 0.00, totalItems: 0.00, pagaIva: 0 }];
      this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    }
  }
}
