import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../../app/services/commonServices';
import { CommonVarService } from '../../../../app/services/common-var.services';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ComprasService } from './compras.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
import { ShowInvoicesComponent } from './show-invoices/show-invoices.component';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  fecha: Date = new Date();
  fecha_compra: any;
  processing: any;
  tip_doc: any;
  dataUser: any;
  permisions: any;
  buyProv: any = { fk_id_proveedor: 0, subtotal: (0.00).toFixed(2), valor_iva: (0.00).toFixed(2), total: (0.00).toFixed(2), tipo_pago: 0, forma_pago: 0, fk_usuario_receive: 0, isActive: 1 };
  dataProducto: any = [{ fk_producto: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, totalItems: 0.00, paga_iva: 1 }];
  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
  arrayProductos: any;
  infoUsers: any;
  tipo_pago: any;
  forma_pago: any;
  flagBtnDired: any = false;
  dataDifered: any = null;
  last_doc: any;
  ivaAux: any;
  arrayProveedor: any;
  vmButtons: any;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private comSrv: ComprasService,
    private modalService: NgbModal
  ) {
    this.commonVarSrv.listenDiferedBuyProv.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrv.listenSetBuyProv.asObservable().subscribe(res => {
      this.buyProv = res;
      this.dataProducto = res['detalle'];
      this.dataDifered = res['type_difered'];
      /* this.actions.btnSave = true;
      this.actions.btnmod = true; */
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
      this.buyProv['last_doc'] = res['num_doc'];
    })

  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "FACTURAS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.fecha_compra = moment(this.fecha).format('YYYY-MM-DD');
    setTimeout(() => {
      this.getPermisions();
    }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fProveeduriaCompras,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de compras de proveeduria");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getProveedores();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getProveedores() {
    this.comSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = {
      params: "'TIPO PAGO','FORMA PAGO'"
    }
    this.comSrv.getCatalogos(data).subscribe(res => {
      this.tipo_pago = res['data']['TIPO PAGO'];
      this.forma_pago = res['data']['FORMA PAGO'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getimpuestos() {
    this.comSrv.getImpuestos().subscribe(res => {
      this.buyProv.iva = res['data'][0];
      this.buyProv.iva = this.buyProv.iva.valor;
      this.buyProv.iva = (this.buyProv.iva / 100) * 100;
      this.ivaAux = this.buyProv.iva;
      this.getUsuario();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUsuario() {
    this.comSrv.getUsuario().subscribe(res => {
      this.infoUsers = res['data'];
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
    this.comSrv.getTypeDocument(data).subscribe(res => {
      this.tip_doc = res['data']['V'];
      this.buyProv.fk_doc = this.tip_doc[0].id;
      this.getProductProveeduria();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getProductProveeduria() {
    this.comSrv.getProductProveeduria().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayProductos = res['data'];
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeDisabledBtn() {
    if (this.buyProv.tipo_pago == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.buyProv.subtotal = 0.00;
      this.buyProv.valor_iva = 0.00;
      this.buyProv.total = 0.00;
      this.dataProducto.splice(index, 1);

      this.dataProducto.forEach(element => {
        this.buyProv.subtotal += element.totalItems;
      });
      this.buyProv.valor_iva = this.buyProv.subtotal * (this.buyProv.iva / 100);
      this.buyProv.total = parseFloat(this.buyProv.subtotal + this.buyProv.valor_iva).toFixed(2);
      this.buyProv.valor_iva = parseFloat(this.buyProv.valor_iva).toFixed(2);
      this.buyProv.subtotal = parseFloat(this.buyProv.subtotal).toFixed(2);
    }
  }

  sumTotal(index) {
    this.buyProv.subtotal = 0.00;
    this.buyProv.valor_iva = 0.00;
    this.buyProv.total = 0.00;

    this.dataProducto[index].totalItems = (this.dataProducto[index].cantidad) * this.dataProducto[index].precio;
    this.dataProducto.forEach(element => {
      this.buyProv.subtotal += element.totalItems;
    });
    this.buyProv.valor_iva = this.buyProv.subtotal * (this.buyProv.iva / 100);
    this.buyProv.total = parseFloat(this.buyProv.subtotal + this.buyProv.valor_iva).toFixed(2);
    this.buyProv.valor_iva = parseFloat(this.buyProv.valor_iva).toFixed(2);
    this.buyProv.subtotal = parseFloat(this.buyProv.subtotal).toFixed(2);
  }

  getDataProduct(evt, index) {
    let filt = this.arrayProductos.filter(e => e.id == evt)[0];
    if (evt != 0) {
      let validt = false;
      this.dataProducto.forEach(element => {
        if (element.codigo == filt.codigo) { validt = true; }
      });
      if (validt) {
        Swal.fire(
          'Atención!',
          'Este producto ya se encuenta en la lista ingresada!',
          'error'
        )
        this.dataProducto[index]['fk_producto'] = 0;
      } else {
        this.dataProducto[index].codigo = filt.codigo;
        this.dataProducto[index].nombre = filt.nombre;
      }
    } else {
      this.dataProducto[index] = { fk_producto: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, totalItems: 0.00, paga_iva: 1 };
    }
  }

  addItems() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = { fk_producto: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, totalItems: 0.00, paga_iva: 1 }
      this.dataProducto.push(items);
    }
  }

  cancel() {
    this.flagBtnDired = false;
    this.buyProv = { fk_id_proveedor: 0, subtotal: (0.00).toFixed(2), valor_iva: (0.00).toFixed(2), total: (0.00).toFixed(2), tipo_pago: 0, forma_pago: 0, fk_usuario_receive: 0, isActive: 1 };
    this.dataProducto = [{ fk_producto: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, totalItems: 0.00, paga_iva: 1 }];
    this.buyProv.fk_doc = this.tip_doc[0].id;
    this.buyProv.iva = this.ivaAux;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.getProductProveeduria();
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedBuyProvComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.buyProv.total.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[1].habilitar;
  }

  async validateSaveBuyProv() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la compra de proveeduria?", "SAVE_PROVEEDURIA");
        }
      })
    }
  }

  async confirmSave(message, action) {
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
        if (action == "SAVE_PROVEEDURIA") {
          this.saveButProv();
        } else if (action == "UPDATED_PROV") {
          this.updatedProv();
        }
      }
    })
  }

  updatedProv() {
    this.lcargando.ctlSpinner(true);
    let proveedor: any = this.arrayProveedor.find(datos => datos.id_proveedor == this.buyProv.fk_id_proveedor);
    let info;
    if (this.buyProv.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.buyProv.total;
      objCoutas['fecha_vencimiento'] = this.fecha_compra;
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.buyProv.total,
        cuotas: 1,
        difered: arrCoutas
      }
    }
    if (this.buyProv.isActive == 0) { this.buyProv['fecha_anulacion'] = moment(this.fecha).format('YYYY-MM-DD') }
    this.buyProv['detalle'] = this.dataProducto;
    this.buyProv['fk_usuario_trans'] = this.dataUser.id_usuario;
    this.buyProv['fecha_compra'] = this.fecha_compra;
    this.buyProv['type_difered'] = (this.buyProv.tipo_pago == "Contado") ? info : this.dataDifered;
    this.buyProv['ip'] = this.commonServices.getIpAddress();
    this.buyProv['id_controlador'] = myVarGlobals.fProveeduriaCompras
    this.buyProv['accion'] = `Actualización de proveeduria con número de documento ${this.buyProv['num_doc']} ${this.buyProv['observacion']}`;
    this.buyProv['ruc'] = proveedor != undefined ? proveedor.num_documento : null;

    this.comSrv.updatedBuyProv(this.buyProv).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  saveButProv() {
    this.lcargando.ctlSpinner(true);
    let proveedor: any = this.arrayProveedor.find(datos => datos.id_proveedor == this.buyProv.fk_id_proveedor);
    let info;
    if (this.buyProv.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.buyProv.total;
      objCoutas['fecha_vencimiento'] = this.fecha_compra;
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.buyProv.total,
        cuotas: 1,
        difered: arrCoutas
      }
    }
    if (this.buyProv.isActive == 0) {
      this.buyProv['fecha_anulacion'] = moment(this.fecha).format('YYYY-MM-DD');
    }

    this.buyProv['detalle'] = this.dataProducto;
    this.buyProv['fk_usuario_trans'] = this.dataUser.id_usuario;
    this.buyProv['fecha_compra'] = this.fecha_compra;
    this.buyProv['type_difered'] = (this.buyProv.tipo_pago == "Contado") ? info : this.dataDifered;
    this.buyProv['ip'] = this.commonServices.getIpAddress();
    this.buyProv['id_controlador'] = myVarGlobals.fProveeduriaCompras;
    this.buyProv['accion'] = `Compra de proveeduria con número de documento ${this.buyProv['num_doc']}`;
    this.buyProv['ruc'] = proveedor != undefined ? proveedor.num_documento : null;

    this.comSrv.saveBuyProv(this.buyProv).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  async validateUpdateProv() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la información?", "UPDATED_PROV");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    let c = 0;
    return new Promise((resolve, reject) => {
      if (this.dataDifered != null && (this.buyProv.total != this.dataDifered.amount)
        && this.buyProv.tipo_pago == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.buyProv.tipo_pago == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.buyProv.tipo_pago == 0) {
        this.toastr.info("Seleccione un tipo de pago");
        document.getElementById("idTipoPagoSelect").focus(); return;
      } else if (this.buyProv.forma_pago == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormaPago").focus(); return;
      } else if (this.buyProv.num_doc == "" || this.buyProv.num_doc == undefined) {
        this.toastr.info("debe ingresar un número de documento");
        document.getElementById("idmudoc").focus(); return;
      } else if (this.buyProv.num_aut == "" || this.buyProv.num_aut == undefined) {
        this.toastr.info("debe ingresar un número de autorización");
        document.getElementById("idNumAut").focus(); return;
      } else if (this.buyProv.fk_id_proveedor == 0) {
        this.toastr.info("debe seleccionar un proveedor");
      } else if (this.buyProv.fk_usuario_receive == 0) {
        this.toastr.info("Seleccione un usuario quien recibe");
      } else if (this.dataProducto.length == 0) {
        this.toastr.info("debe ingresar al menos un producto");
      } else if (this.dataProducto.length == 1 && this.dataProducto[0].fk_producto == 0) {
        this.toastr.info("debe seleccionar al menos un producto");
      } else if (this.buyProv.isActive == 0 && (this.buyProv.observacion == "" || this.buyProv.observacion == null || this.buyProv.observacion == undefined)) {
        this.toastr.info("Ingrese una observación por la cual el estado es Inactivo");
        document.getElementById('idtxta').focus(); return;
      } else {
        c = 0;
        this.dataProducto.forEach(element => {
          if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
            element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise la información en los items, el precio o la cantidad no pueden ser 0") }
            flag = true; return;
          }
        });
        (!flag) ? resolve(true) : resolve(false);
      }
    });
  }

  showFacturas() {
    const modalInvoice = this.modalService.open(ShowInvoicesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveBuyProv();
        break;
      case "MODIFICAR":
        this.validateUpdateProv();
        break;
      case "FACTURAS":
        this.showFacturas();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
