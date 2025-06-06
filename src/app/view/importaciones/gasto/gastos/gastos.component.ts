import { Component, OnInit, ViewChild } from '@angular/core';
import { GastosService } from './gastos.service';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Socket } from '../../../../services/socket.service';
import { ShowGastosComponent } from './show-gastos/show-gastos.component';
import { DiferedCuotasComponent } from './difered-cuotas/difered-cuotas.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
  dataUser: any;
  permisions: any;
  importPed: any = {
    fk_provider: 0, aplica_a: 'Pedido', fk_ped_liq: 0, fk_grupo_gasto: 0, fecha: new Date(), tipo_pago: 0, forma_pago: 0, subTotal: parseFloat('0.00').toFixed(2),
    iva: parseFloat('0.00').toFixed(2), total: parseFloat('0.00').toFixed(2), tip_doc_gasto: 0
  };
  arrayGastos: any = [{ fk_rubro_det: 0, fk_rubro: 0, obligatorio: 0, cuenta: null, valor: parseFloat('0.00').toFixed(4), paga_iva: 0, acumula_en: "Acumula en ?", type_acumula: "N/A" }];
  arrayProveedor: any;
  numSec: any;
  secGlobal: any;
  arrayPedidos: any;
  arrayLiquidaciones: any;
  arrayRubros: any;
  flagBtnDired: any = false;
  dataDifered: any = null;
  tipo_pago: any;
  forma_pago: any;
  arrayGastosDet: any;
  ivaConverter: any;
  subTotalAux: any = parseFloat('0.00').toFixed(4);
  ivaAux: any = parseFloat('0.00').toFixed(4);
  totalAux: any = parseFloat('0.00').toFixed(4);
  arrayTipoDoc: any;
  accountIvanImp: any;
  vmButtons: any;


  constructor(
    private gstSrv: GastosService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private socket: Socket
  ) {

    this.commonVarSrv.listenDiferedGastosImp.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarSrv.cancelImpGasto.asObservable().subscribe(res => {
      this.cancel();
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrv.listenGastosImp.asObservable().subscribe(res => {
      let arrayAux = [];
      this.getDetalleTipoGasto(res.fk_grupo_gasto);
      this.importPed = res;
      this.importPed['subTotal'] = parseFloat(res['subTotal']);
      this.importPed['iva'] = parseFloat(this.importPed['iva']);
      this.importPed['total'] = parseFloat(this.importPed['total']);
      this.subTotalAux = this.commonServices.formatNumber(this.importPed.subTotal);
      this.ivaAux = this.commonServices.formatNumber(this.importPed.iva);
      this.totalAux = this.commonServices.formatNumber(this.importPed.total);
      this.arrayGastos = res['detalle'];
      this.dataDifered = res['type_difered'];
      this.actions.btnSave = true;
      this.actions.btnmod = true;

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
      this.arrayGastos.forEach(element => {
        element['valor'] = parseFloat(element['valor']).toFixed(4)
      });
      this.arrayGastos.forEach(element => {
        if (element['fk_rubro'] != 0) {
          arrayAux.push(element);
        }
      });
      this.arrayGastos = arrayAux;
    })

  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsGtsImp", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsGtsImp", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsGtsImp", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "GASTOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsGtsImp", paramAccion: "", boton: { icon: "fas fa-arrow-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.getPermisions();
    }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fGastosImportacion,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de gastos ");
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
    this.gstSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getSecuencia();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSecuencia() {
    let data = {
      id: [27]
    }
    this.gstSrv.getSecuencia(data).subscribe(res => {
      this.secGlobal = res['data'];
      this.numSec = res['data'][0]['codigo'] + "-" + res['data'][0]['secuencia'].toString().padStart(10, '0');
      this.getPedidos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getPedidos() {
    this.gstSrv.getPedidosGastos().subscribe(res => {
      this.arrayPedidos = res['data'];
      this.getTipoPedidos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTipoPedidos() {
    this.gstSrv.getTipoGastos().subscribe(res => {
      this.arrayRubros = res['data'];
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
    this.gstSrv.getCatalogos(data).subscribe(res => {
      this.tipo_pago = res['data']['TIPO PAGO'];
      this.forma_pago = res['data']['FORMA PAGO'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getimpuestos() {
    this.gstSrv.getImpuestos().subscribe(res => {
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypeDocument() {
    let data = {
      params: "'C'"
    }
    this.gstSrv.getTypeDocument(data).subscribe(res => {
      this.arrayTipoDoc = res['data']['C'];
      this.getCuentaIvaImportacion();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCuentaIvaImportacion() {
    this.gstSrv.getCuentaIvaImportacion({ id: 40 }).subscribe(res => {
      this.accountIvanImp = res['data'][0];
      this.getLiquidaciones();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getLiquidaciones() {
    this.gstSrv.getLiquidacionesGastos().subscribe(res => {
      this.arrayLiquidaciones = res['data'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeDisabledBtn() {
    if (this.importPed.tipo_pago == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  getDetalleTipoGasto(evt) {
    if (evt != 0) {
      this.arrayGastosDet = this.arrayRubros.filter(e => e.id == evt)[0]['detalle'];
      this.arrayGastosDet = this.arrayGastosDet.filter(ety => ety.tipo_gasto == this.importPed.aplica_a);
      //this.arrayGastosDet = this.arrayGastosDet.filter(ev => ev.type_acumula != 'N/A');
    }
    this.arrayGastos = [{ fk_rubro_det: 0, fk_rubro: 0, obligatorio: 0, cuenta: null, valor: parseFloat('0.00').toFixed(4), paga_iva: 0, acumula_en: "Acumula en ?", type_acumula: "N/A" }];
    this.importPed.subTotal = parseFloat('0.00').toFixed(4);
    this.importPed.iva = parseFloat('0.00').toFixed(4);
    this.importPed.total = parseFloat('0.00').toFixed(4);
    this.subTotalAux = parseFloat('0.00').toFixed(4);
    this.ivaAux = parseFloat('0.00').toFixed(4);
    this.totalAux = parseFloat('0.00').toFixed(4);
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedCuotasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.totalAux.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[1].habilitar;
  }

  addItems() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if (this.arrayGastos.length < this.arrayGastosDet.length) {
        let items = { fk_rubro_det: 0, fk_rubro: 0, obligatorio: 0, cuenta: null, valor: 0.00, paga_iva: 0, acumula_en: "Acumula en ?", type_acumula: "N/A" };
        this.arrayGastos.push(items);
      } else {
        this.toastr.info('No se puede agregar más número de rubros de los que existen para este tipo de gasto');
      }
    }
  }

  getDetGastos(evt, index) {
    let validt = false;
    if (evt == 0) {
      this.toastr.info('Seleccione un rubro');
    } else {
      setTimeout(() => {
        this.arrayGastos[index].valor = "";
        document.getElementById('value' + index).focus();
      }, 50);
      let filt = this.arrayGastosDet.filter(e => e.id == evt)[0];
      this.arrayGastos[index].valor = parseFloat('0.00').toFixed(4);
      this.arrayGastos[index].fk_rubro = filt.fk_rubro;
      this.arrayGastos[index].obligatorio = filt.obligatorio;
      this.arrayGastos[index].cuenta = filt.cuenta;
      this.arrayGastos[index].nombre_cuenta = filt.nombre_cuenta;
      this.arrayGastos[index].paga_iva = filt.paga_iva;
      this.arrayGastos[index].acumula_en = filt.acumula_en;
      this.arrayGastos[index].nombre = filt.nombre;
      this.arrayGastos[index].type_acumula = filt.type_acumula;
      this.sumTotal(index);
    }
  }

  sumTotal(index?) {
    this.importPed.subTotal = parseFloat('0.00');
    this.importPed.iva = parseFloat('0.00');
    this.importPed.total = parseFloat('0.00');
    let ivaBase = parseFloat('0.00');

    this.arrayGastos.forEach(element => {
      this.importPed.subTotal = (element.valor == null) ? this.importPed.subTotal + parseFloat('0.00') : this.importPed.subTotal + parseFloat(element.valor);
      if (element.paga_iva == 1) {
        ivaBase += (element.valor == null) ? ivaBase + parseFloat('0.00') : ivaBase + parseFloat(element.valor);
      }
    });

    this.importPed.iva = (this.importPed.tip_doc_gasto == 10) ? ivaBase * (this.ivaConverter / 100) : parseFloat('0.00');
    this.importPed.total = this.importPed.subTotal + this.importPed.iva;

    /*le coloco 2 decimales*/
    this.subTotalAux = Number.isNaN(this.importPed.subTotal) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.subTotal.toFixed(4));
    this.ivaAux = Number.isNaN(this.importPed.iva) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.iva.toFixed(4));
    this.totalAux = Number.isNaN(this.importPed.total) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.total.toFixed(4));
  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.importPed.subTotal = parseFloat('0.00');
      this.importPed.iva = parseFloat('0.00');
      this.importPed.total = parseFloat('0.00');
      let ivaBase = parseFloat('0.00');

      this.arrayGastos.splice(index, 1);
      this.arrayGastos.forEach(element => {
        this.importPed.subTotal = (element.valor == null) ? this.importPed.subTotal + parseFloat('0.00') : this.importPed.subTotal + parseFloat(element.valor);
        if (element.paga_iva == 1) {
          ivaBase += (element.valor == null) ? ivaBase + parseFloat('0.00') : ivaBase + parseFloat(element.valor);
        }
      });

      this.importPed.iva = (this.importPed.tip_doc_gasto == 10) ? ivaBase * (this.ivaConverter / 100) : parseFloat('0.00');
      this.importPed.total = this.importPed.subTotal + this.importPed.iva;

      /*le coloco 2 decimales*/
      this.subTotalAux = Number.isNaN(this.importPed.subTotal) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.subTotal);
      this.ivaAux = Number.isNaN(this.importPed.iva) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.iva);
      this.totalAux = Number.isNaN(this.importPed.total) ? parseFloat('0.00') : this.commonServices.formatNumber(this.importPed.total);
    }
  }

  setRuc(evt) {
    if (evt != 0) {
      this.importPed.ruc = this.arrayProveedor.filter(e => e.id_proveedor == evt)[0]['num_documento'];
      this.importPed.razon_social = this.arrayProveedor.filter(e => e.id_proveedor == evt)[0]['razon_social'];
    }
  }

  getNumautNumFac(evt) {
    if (evt == 0) { this.importPed.num_doc_gasto = ""; }
    if (this.arrayGastos[0]['fk_rubro_det'] != 0) { this.sumTotal() }
  }

  async validateSaveGastoImp() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar los gastos?", "SAVE_GASTO");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    let contador = 0;
    return new Promise((resolve, reject) => {
      if (this.importPed.fk_provider == 0) {//&& this.importPed.aplica_a == "Pedido"
        this.toastr.info("Seleccione un proveedor");
      } else if (this.importPed.fk_ped_liq == 0) {
        this.toastr.info("Seleccione un pedido");
        document.getElementById("idPedido").focus(); return;
      } else if (this.importPed.fk_grupo_gasto == 0) {
        this.toastr.info("Seleccione un tipo de gasto");
        document.getElementById("idGasto").focus(); return;
      } else if (this.importPed.tipo_pago == 0) {
        this.toastr.info("Seleccione un tipo de pago");
        document.getElementById("idTipoPagoSelect").focus(); return;
      } else if (this.importPed.forma_pago == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormaPago").focus(); return;
      } else if (this.dataDifered != null && (parseFloat(this.importPed.total).toFixed(2) != parseFloat(this.dataDifered.amount).toFixed(2))
        && this.importPed.tipo_pago == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.importPed.tipo_pago == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.importPed.tip_doc_gasto != 0 && (this.importPed.num_doc_gasto == "" || this.importPed.num_doc_gasto == undefined || this.importPed.num_doc_gasto == null)) {
        this.toastr.info("Ingrese número de documento");
        document.getElementById("iddocref").focus(); return;
      } else {
        let c = 0;
        for (let index = 0; index < this.arrayGastos.length; index++) {
          if (this.arrayGastos[index].fk_rubro_det == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Falta de seleccionar un rubro"); }
            flag = true; return;
          } else if (this.arrayGastos[index].valor <= 0 || this.arrayGastos[index].valor == null) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise el valor ingesado, no puede estar vacio o ser 0"); }
            flag = true; return;
          } else {
            contador = 0;
            this.arrayGastos.forEach(elmt => {
              if (this.arrayGastos[index]['fk_rubro_det'] == elmt['fk_rubro_det']) {
                contador += 1;
                if (contador > 1) {
                  c += 1;
                  if (c == 1) {
                    this.toastr.info("No se pueden repetir los rubros en un mismo gasto");
                    flag = true; return;
                  }
                }
              }
            });
          }
        }
        (!flag) ? resolve(true) : resolve(false);
      }
    });
  }

  async confirmSave(message, action, infodev?: any) {
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
        if (action == "SAVE_GASTO") {
          this.saveGasto();
        } else if (action == "UPDATE_GASTOS") {
          this.update();
        }
      }
    })
  }

  saveGasto() {
    this.lcargando.ctlSpinner(true);
    let info;
    if (this.importPed.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.importPed.total;
      objCoutas['fecha_vencimiento'] = moment(this.importPed.fecha).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.importPed.total,
        cuotas: 1,
        difered: arrCoutas
      }
    }

    if (this.importPed.iva > parseFloat('0.00')) {
      let cuentaIva = {
        acumula_en: "N/A",
        cuenta: this.accountIvanImp.cuenta_contable,
        fk_rubro: 0,
        fk_rubro_det: "0",
        nombre: "N/A",
        nombre_cuenta: this.accountIvanImp.nombre_cuenta,
        obligatorio: 0,
        paga_iva: 0,
        valor: this.importPed.iva
      }
      this.arrayGastos.push(cuentaIva);
    }

    this.importPed['type_difered'] = (this.importPed.tipo_pago == "Contado") ? info : this.dataDifered;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `creación de gastos de importación por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fGastosImportacion;
    this.importPed['num_cuotas'] = this.importPed['type_difered']['cuotas'];
    this.importPed['detalle'] = this.arrayGastos;
    this.importPed['fecha'] = moment(this.importPed.fecha).format('YYYY-MM-DD');
    this.importPed['fk_empresa'] = this.dataUser.id_empresa;
    this.importPed['fk_usuario'] = this.dataUser.id_usuario;
    this.importPed['fk_tipo_doc'] = this.secGlobal[0].id;
    this.importPed['secuencia'] = this.secGlobal[0].secuencia;
    this.gstSrv.saveGasto(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      document.getElementById("iddocref").focus();
      this.toastr.info(error.error.message);
    })
  }

  update() {
    this.lcargando.ctlSpinner(true);
    let info;
    if (this.importPed.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.importPed.total;
      objCoutas['fecha_vencimiento'] = moment(this.importPed.fecha).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.importPed.total,
        cuotas: 1,
        difered: arrCoutas
      }
    }

    if (this.importPed.iva > parseFloat('0.00')) {
      let cuentaIva = {
        acumula_en: "N/A",
        cuenta: this.accountIvanImp.cuenta_contable,
        fk_rubro: 0,
        fk_rubro_det: "0",
        nombre: "N/A",
        nombre_cuenta: this.accountIvanImp.nombre_cuenta,
        obligatorio: 0,
        paga_iva: 0,
        valor: this.importPed.iva
      }
      this.arrayGastos.push(cuentaIva);
    }

    this.importPed['type_difered'] = (this.importPed.tipo_pago == "Contado") ? info : this.dataDifered;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Actualización de gastos de importación por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fGastosImportacion;
    this.importPed['num_cuotas'] = this.importPed['type_difered']['cuotas'];
    this.importPed['detalle'] = this.arrayGastos;
    this.importPed['fecha'] = moment(this.importPed.fecha).format('YYYY-MM-DD');
    this.importPed['fk_empresa'] = this.dataUser.id_empresa;
    this.importPed['fk_usuario'] = this.dataUser.id_usuario;

    this.gstSrv.updateGastos(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      document.getElementById("iddocref").focus();
      this.toastr.info(error.error.message);
    })
  }

  showgastos() {
    let id = this.secGlobal[0]['id'];
    const modalInvoice = this.modalService.open(ShowGastosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fGastosImportacion;
    modalInvoice.componentInstance.id_document = id;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  async validateUpdateGastosImp() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar los gastos?", "UPDATE_GASTOS");
        }
      })
    }
  }

  cancel() {
    this.actions = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.importPed = {
      fk_provider: 0, aplica_a: 'Pedido', fk_ped_liq: 0, fk_grupo_gasto: 0, fecha: new Date(), tipo_pago: 0, forma_pago: 0, subTotal: parseFloat('0.00').toFixed(4),
      iva: parseFloat('0.00').toFixed(4), total: parseFloat('0.00').toFixed(4), tip_doc_gasto: 0
    };
    this.arrayGastos = [{ fk_rubro_det: 0, fk_rubro: 0, obligatorio: 0, cuenta: null, valor: parseFloat('0.00').toFixed(4), paga_iva: 0, acumula_en: "Acumula en ?", type_acumula: "N/A" }];
    this.flagBtnDired = false;
    this.dataDifered = null;
    this.subTotalAux = parseFloat('0.00').toFixed(4);
    this.ivaAux = parseFloat('0.00').toFixed(4);
    this.totalAux = parseFloat('0.00').toFixed(4);
    this.getSecuencia();
  }

  filterTiposGasto() {
    this.importPed.fk_grupo_gasto = 0;
    this.importPed.fk_ped_liq = 0;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveGastoImp();
        break;
      case "MODIFICAR":
        this.validateUpdateGastosImp();
        break;
      case "GASTOS":
        this.showgastos();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
