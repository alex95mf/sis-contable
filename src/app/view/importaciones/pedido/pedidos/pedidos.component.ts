import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidosService } from './pedidos.service';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DiferedCuotesComponent } from './difered-cuotes/difered-cuotes.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Socket } from '../../../../services/socket.service';
import { ShowPedidosComponent } from './show-pedidos/show-pedidos.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
  dataProducto: any = [{
    num_parte: null, fk_producto: 0, nombre: null, codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
    pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00")
  }];
  importPed: any = {
    fk_provider: 0, fk_pais: 54, icoterm: 0, tipo_pago: 0, forma_pago: 0, total: parseFloat("0.00").toFixed(4),
    fecha_ped: new Date(), fecha_lleg: new Date(), paga_seguro: 1, estado: "Pendiente", tip_doc_compra: "INVOICE", gasto_origen: false,
    anulado: 0, pagado: 0, total_pedido: parseFloat("0.00").toFixed(4), total_seguro: parseFloat("0.00").toFixed(4), total_transp: parseFloat("0.00").toFixed(4), total_gasto: parseFloat("0.00").toFixed(4)
  };

  flagBtnDired: any = false;
  tipo_pago: any;
  forma_pago: any;
  dataUser: any;
  permisions: any;
  arrayCountrys: any;
  arrayProveedor: any;
  arrayProductos: any;
  dataDifered: any = null;
  ivaConverter: any;
  arrayIcoterm: any;
  numSec: any;
  secGlobal: any;
  prefict: any;
  latestStatus: any;
  detAux: any = [];
  vmButtons: any = [];
  flag:any = "assets/img/flags/flag-little/flag-black.png";

  constructor(
    private impSrv: PedidosService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private socket: Socket
  ) {
    this.commonVarSrv.listenDiferedPedidosImp.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarSrv.cancelImpPed.asObservable().subscribe(res => {
      this.cancel();
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrv.listenPedidosImp.asObservable().subscribe(res => {
      this.importPed = res;
      this.importPed['total_seguro'] = parseFloat(this.importPed['total_seguro']).toFixed(4);
      this.importPed['total_pedido'] = parseFloat(this.importPed['total_pedido']).toFixed(4);
      this.importPed['total_transp'] = parseFloat(this.importPed['total_transp']).toFixed(4);
      this.importPed['total'] = parseFloat(this.importPed['total']).toFixed(4);
      this.importPed['total_gasto'] = parseFloat(this.importPed['total_gasto']).toFixed(4);
      this.dataProducto = res['detalle'];
      this.dataDifered = res['type_difered'];
      /* this.actions.btnSave = true;
      this.actions.btnmod = true; */
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
      this.dataProducto.forEach(element => {
        element['precio'] = parseFloat(element['precio']).toFixed(4);
        element['total'] = parseFloat(element['total']).toFixed(4);
        element['cantidad'] = parseFloat(element['cantidad']).toFixed(4);
      });
      this.changeFlag();
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsPedImp", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnsPedImp", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnsPedImp", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PEDIDOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnsPedImp", paramAccion: "", boton: { icon: "fas fa-arrow-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
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
      codigo: myVarGlobals.fImpPedido,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de pedidos de importación");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCatalogos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = {
      params: "'TIPO PAGO','FORMA PAGO'"
    }
    this.impSrv.getCatalogos(data).subscribe(res => {
      this.tipo_pago = res['data']['TIPO PAGO'];
      this.forma_pago = res['data']['FORMA PAGO'];
      this.getCurrencys();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  changeDisabledBtn() {
    if (this.importPed.tipo_pago == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  getCurrencys() {
    this.impSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data'];
      this.changeFlag();
      this.getProveedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getProveedores() {
    this.impSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getProductos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getProductos() {
    let data = {
      clase: ['Productos']
    }
    this.impSrv.searchProduct(data).subscribe(res => {
      this.arrayProductos = res['data'];
      this.arrayProductos.forEach(element => {
        element['PVP'] = parseFloat('0.00');
      });
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.impSrv.getImpuestos().subscribe(res => {
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
      this.getIcoterms();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getIcoterms() {
    this.impSrv.getIcoterms().subscribe(res => {
      this.arrayIcoterm = res['data'];
      this.getSecuencia();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSecuencia() {
    let data = {
      id: [26]
    }
    this.impSrv.getSecuencia(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.secGlobal = res['data'];
      this.numSec = res['data'][0]['codigo'] + "-" + res['data'][0]['secuencia'].toString().padStart(10, '0');
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCountry(evt) {
    this.importPed.moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['codigo_iso'];
    this.importPed.name_pais_moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['nom_pais'];
  }

  addItems() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = {
        num_parte: null, fk_producto: 0, nombre: null, codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
        pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00")
      };
      this.dataProducto.push(items);
    }
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedCuotesComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.importPed.total.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[1].habilitar;
  }

  getDataProduct(evt, index) {
    if (evt == 0) {
      this.toastr.info('Seleccione producto');
    } else {
      setTimeout(() => {
        this.dataProducto[index].cantidad = "" ;
        document.getElementById('quanty'+index).focus();
      }, 50);
      let filt = this.arrayProductos.filter(e => e.id_producto == evt);
      filt = filt[0];
      let validt = false;
      this.dataProducto.forEach(element => {
        if (element.codigo_pro == filt.codigoProducto) { validt = true; }
      });
      if (validt) {
        this.dataProducto[index] = {
          num_parte: null, fk_producto: 0, nombre: null, codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
          pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00")
        };
        Swal.fire(
          'Atención!',
          'Este producto ya se encuenta en la lista ingresada!',
          'error'
        )
      } else {
        this.dataProducto[index].precio = Number.isNaN(filt.PVP) ? parseFloat('0.00') : parseFloat(filt.PVP).toFixed(4);
        this.dataProducto[index].codigo_pro = filt.codigoProducto;
        this.dataProducto[index].pesoKg = filt.conversion_masa_kg;
        this.dataProducto[index].volumenm3 = filt.volumen_m3;
        this.dataProducto[index].nombre = filt.nombre;
        this.dataProducto[index].num_parte = filt.num_parte;
        this.dataProducto[index].partida_cod = filt.arancel.codigo;
        this.dataProducto[index].partida_por = filt.arancel.tarifa_arancelaria;
        this.sumTotal(index);
      }
    }
  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (!this.vmButtons[1].habilitar) {
        var potjPeso = parseFloat('0.00');
        var potjVol = parseFloat('0.00');
        var potjValor = parseFloat('0.00');

        this.importPed.total_pedido = parseFloat('0.00');
        this.importPed.total = parseFloat('0.00');
        this.importPed.peso = parseFloat('0.00');
        this.importPed.volumen = parseFloat('0.00');
        this.dataProducto.splice(index, 1);

        this.dataProducto.forEach(element => {
          element.total = parseFloat(element.total);
          this.importPed.total_pedido = parseFloat(this.importPed.total_pedido) + /* parseFloat( */element.total/* ) */;
          element.peso = parseFloat(element.cantidad) * parseFloat(element.pesoKg);
          element.volumen = (parseFloat(element.cantidad)) * (parseFloat(element.volumenm3));
          potjPeso += element.peso;
          potjVol += element.volumen;
          potjValor += element.total;

          element.total_Pcj_kg = parseFloat('0.00');
          element.total_Pcj_vol = parseFloat('0.00');
          element.total_Pcj_value = parseFloat('0.00');
        });

        Object.keys(this.dataProducto).forEach(key => {
          this.dataProducto[key].total_Pcj_kg = this.getReglaDeTresPorcentaje(potjPeso, this.dataProducto[key].peso);
          this.dataProducto[key].total_Pcj_vol = this.getReglaDeTresPorcentaje(potjVol, this.dataProducto[key].volumen);
          this.dataProducto[key].total_Pcj_value = this.getReglaDeTresPorcentaje(potjValor, this.dataProducto[key].total);
        })

        this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.importPed.total_seguro) + parseFloat(this.importPed.total_transp) + parseFloat(this.importPed.total_gasto);
        this.importPed.total = Number.isNaN(this.importPed.total) ? 0.00 : parseFloat(this.importPed.total).toFixed(4);
        this.importPed.total_pedido = Number.isNaN(this.importPed.total_pedido) ? "0.00" : parseFloat(this.importPed.total_pedido).toFixed(4);
      } else {

        let pedDet = this.dataProducto[index]['id'];
        this.detAux.push(pedDet);

        var potjPeso = parseFloat('0.00');
        var potjVol = parseFloat('0.00');
        var potjValor = parseFloat('0.00');

        this.importPed.total_pedido = parseFloat('0.00');
        this.importPed.total = parseFloat('0.00');
        this.importPed.peso = parseFloat('0.00');
        this.importPed.volumen = parseFloat('0.00');
        this.dataProducto.splice(index, 1);

        this.dataProducto.forEach(element => {
          element.total = parseFloat(element.total);
          this.importPed.total_pedido = parseFloat(this.importPed.total_pedido) + /* parseFloat( */element.total/* ) */;
          element.peso = parseFloat(element.cantidad) * parseFloat(element.pesoKg);
          element.volumen = (parseFloat(element.cantidad)) * (parseFloat(element.volumenm3));
          potjPeso += element.peso;
          potjVol += element.volumen;
          potjValor += element.total;

          element.total_Pcj_kg = parseFloat('0.00');
          element.total_Pcj_vol = parseFloat('0.00');
          element.total_Pcj_value = parseFloat('0.00');
        });

        Object.keys(this.dataProducto).forEach(key => {
          this.dataProducto[key].total_Pcj_kg = this.getReglaDeTresPorcentaje(potjPeso, this.dataProducto[key].peso);
          this.dataProducto[key].total_Pcj_vol = this.getReglaDeTresPorcentaje(potjVol, this.dataProducto[key].volumen);
          this.dataProducto[key].total_Pcj_value = this.getReglaDeTresPorcentaje(potjValor, this.dataProducto[key].total);
        })

        this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.importPed.total_seguro) + parseFloat(this.importPed.total_transp) + parseFloat(this.importPed.total_gasto);
        this.importPed.total = Number.isNaN(this.importPed.total) ? 0.00 : parseFloat(this.importPed.total).toFixed(4);
        this.importPed.total_pedido = Number.isNaN(this.importPed.total_pedido) ? "0.00" : parseFloat(this.importPed.total_pedido).toFixed(4);
      }
    }
  }

  sumTotal(index) {
    var potjPeso = parseFloat('0.00');
    var potjVol = parseFloat('0.00');
    var potjValor = parseFloat('0.00');

    this.importPed.total_pedido = parseFloat('0.00');
    this.importPed.total = parseFloat('0.00');
    this.importPed.peso = parseFloat('0.00');
    this.importPed.volumen = parseFloat('0.00');
    this.dataProducto[index].total = this.dataProducto[index].cantidad * this.dataProducto[index].precio;

    this.dataProducto.forEach(element => {
      element.total = parseFloat(element.total);
      this.importPed.total_pedido = parseFloat(this.importPed.total_pedido) + /* parseFloat( */element.total/* ) */;
      element.peso = Number.isNaN(parseFloat(element.cantidad) * parseFloat(element.pesoKg)) ? "0.00" : (parseFloat(element.cantidad) * parseFloat(element.pesoKg));
      element.volumen = Number.isNaN(parseFloat(element.cantidad) * parseFloat(element.volumenm3)) ? "0.00" : (parseFloat(element.cantidad) * parseFloat(element.volumenm3));
      potjPeso += element.peso;
      potjVol += element.volumen;
      potjValor += element.total;

      element.total_Pcj_kg = parseFloat('0.00');
      element.total_Pcj_vol = parseFloat('0.00');
      element.total_Pcj_value = parseFloat('0.00');
    });

    Object.keys(this.dataProducto).forEach(key => {
      this.dataProducto[key].total_Pcj_kg = this.getReglaDeTresPorcentaje(potjPeso, this.dataProducto[key].peso);
      this.dataProducto[key].total_Pcj_vol = this.getReglaDeTresPorcentaje(potjVol, this.dataProducto[key].volumen);
      this.dataProducto[key].total_Pcj_value = this.getReglaDeTresPorcentaje(potjValor, this.dataProducto[key].total);
    })

    this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.importPed.total_seguro) + parseFloat(this.importPed.total_transp) + parseFloat(this.importPed.total_gasto);
    this.importPed.total = Number.isNaN(this.importPed.total) ? 0.00 : parseFloat(this.importPed.total).toFixed(4);
    this.importPed.total_pedido = Number.isNaN(this.importPed.total_pedido) ? "0.00" : parseFloat(this.importPed.total_pedido).toFixed(4);
  }

  getReglaDeTresPorcentaje(val1, val2) {
    let result = 0;
    result = 100 * val2;
    result = result / val1;
    return parseFloat(result.toString()).toFixed(4);
  }

  sumTotalGeneral() {
    this.importPed.total = 0.00;
    this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.importPed.total_seguro) + parseFloat(this.importPed.total_transp) + parseFloat(this.importPed.total_gasto);
    this.importPed.total = Number.isNaN(this.importPed.total) ? 0.00 : parseFloat(this.importPed.total).toFixed(4);
  }

  tabSelection() {
    this.importPed.gasto_origen = !this.importPed.gasto_origen;
  }

  async validateSavePedidoImp() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar el pedido?", "SAVE_PEDIDO");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.importPed.fk_provider == 0) {
        this.toastr.info("Seleccione un proveedor");
      } else if (this.importPed.tip_doc_compra == "" ||  this.importPed.tip_doc_compra == undefined ||  this.importPed.tip_doc_compra == null) {
        this.toastr.info("Ingrese un tipo de documento");
        document.getElementById("idtiprefdoc").focus(); return;
      } else if (this.importPed.num_doc_compra == "" ||  this.importPed.num_doc_compra == undefined ) {
        this.toastr.info("Ingrese un número de documento");
        document.getElementById("iddocref").focus(); return;
      } else if (this.importPed.tipo_pago == 0) {
        this.toastr.info("Seleccione un tipo de pago");
        document.getElementById("idTipoPagoSelect").focus(); return;
      } else if (this.importPed.forma_pago == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormaPago").focus(); return;
      } else if (this.dataDifered != null && (this.importPed.total_pedido != this.dataDifered.amount)
        && this.importPed.tipo_pago == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.importPed.tipo_pago == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.importPed.icoterm == 0) {
        this.toastr.info("Seleccione Icoterm");
        document.getElementById("idIcotemr").focus(); return;
      } else if (this.importPed.observacion == "" || this.importPed.observacion == undefined) {
        this.toastr.info("Ingrese una observación");
        document.getElementById("idobs").focus(); return;
      } else {
        for (let index = 0; index < this.dataProducto.length; index++) {
          if (this.dataProducto[index].fk_producto == 0) {
            this.toastr.info("Falta de seleccionar un producto");
            flag = true; break;
          } else if (this.dataProducto[index].cantidad <= 0) {
            this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
            flag = true; break;
          } else if (this.dataProducto[index].precio <= 0) {
            this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0");
            flag = true; break;
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
        if (action == "SAVE_PEDIDO") {
          this.savePedido();
        } else if (action == "UPDATE_PEDIDO") {
          this.update();
        }
      }
    })
  }

  savePedido() {
    this.lcargando.ctlSpinner(true);
    let info;
    if (this.importPed.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = parseFloat(this.importPed.total_pedido).toFixed(2);
      objCoutas['fecha_vencimiento'] = moment(this.importPed.fecha_ped).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: parseFloat(this.importPed.total_pedido).toFixed(4),
        cuotas: 1,
        difered: arrCoutas
      }
    }

    this.importPed['fecha_ped'] = moment(this.importPed.fecha_ped).format('YYYY-MM-DD');
    this.importPed['fecha_lleg'] = moment(this.importPed.fecha_lleg).format('YYYY-MM-DD');
    this.importPed['detalle'] = this.dataProducto;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `creación de pedido de importación por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fImpPedido;
    this.importPed['type_difered'] = (this.importPed.tipo_pago == "Contado") ? info : this.dataDifered;
    this.importPed['fk_empresa'] = this.dataUser.id_empresa;
    this.importPed['fk_user_ped'] = this.dataUser.id_usuario;
    this.importPed['fk_tip_doc'] = this.secGlobal[0].id;
    this.importPed['num_doc'] = this.secGlobal[0].secuencia;
    this.importPed['gasto_origen'] = (this.importPed.gasto_origen) ? 1 : 0;
    this.importPed['num_cuotas'] = this.importPed['type_difered']['cuotas'];

    this.impSrv.saveorder(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      document.getElementById("iddocref").focus();
      this.toastr.info(error.error.message);
    })
  }

  cancel() {
    /* this.actions = { btnSave: false, btnmod: false, btnfac: false, btncancel: false }; */
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.dataProducto = [{
      num_parte: null, fk_producto: 0, nombre: null, codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
      pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00")
    }];
    this.importPed = {
      fk_provider: 0, fk_pais: 54, icoterm: 0, tipo_pago: 0, forma_pago: 0, total: parseFloat("0.00").toFixed(4),
      fecha_ped: new Date(), fecha_lleg: new Date(), paga_seguro: 1, estado: "Pendiente", tip_doc_compra: "INVOICE", gasto_origen: false,
      anulado: 0, pagado: 0, total_pedido: parseFloat("0.00").toFixed(4), total_seguro: parseFloat("0.00").toFixed(4), total_transp: parseFloat("0.00").toFixed(4), total_gasto: parseFloat("0.00").toFixed(4)
    };
    this.detAux = [];
    this.flagBtnDired = false;
    this.dataDifered = null;
    this.getIcoterms();
  }

  setRuc(evt) {
    this.importPed.ruc = this.arrayProveedor.filter(e => e.id_proveedor == evt)[0]['num_documento'];
  }

  setGastOrigen(evt) {
    this.importPed.gasto_origen = this.arrayIcoterm.filter(e => e.id == evt)[0]['gasto_origen'];
  }

  async validateUpdatePedidoImp() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar el pedido?", "UPDATE_PEDIDO");
        }
      })
    }
  }

  update() {
    this.lcargando.ctlSpinner(true);
    let info;
    if (this.importPed.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = parseFloat(this.importPed.total_pedido).toFixed(4);
      objCoutas['fecha_vencimiento'] = moment(this.importPed.fecha_ped).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: parseFloat(this.importPed.total_pedido).toFixed(2),
        cuotas: 1,
        difered: arrCoutas
      }
    }

    this.importPed['fecha_ped'] = moment(this.importPed.fecha_ped).format('YYYY-MM-DD');
    this.importPed['fecha_lleg'] = moment(this.importPed.fecha_lleg).format('YYYY-MM-DD');
    this.importPed['detalle'] = this.dataProducto;
    this.importPed['detalleAux'] = this.detAux;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Actualización de pedido de importación por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fImpPedido;
    this.importPed['fk_tip_doc'] = this.secGlobal[0].id;
    this.importPed['gasto_origen'] = (this.importPed.gasto_origen) ? 1 : 0;
    this.importPed['type_difered'] = (this.importPed.tipo_pago == "Contado") ? info : this.dataDifered;
    this.importPed['num_cuotas'] = this.importPed['type_difered']['cuotas'];

    this.impSrv.updatedPedido(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  showPedidos() {
    let id = this.secGlobal[0]['id'];
    const modalInvoice = this.modalService.open(ShowPedidosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fImpPedido;
    modalInvoice.componentInstance.id_document = id;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSavePedidoImp();
        break;
      case "MODIFICAR":
        this.validateUpdatePedidoImp();
        break;
      case "PEDIDOS":
        this.showPedidos();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  changeFlag(){
    if(this.importPed.fk_pais != 0){
      this.flag = this.arrayCountrys.filter(e => e.id == this.importPed.fk_pais)[0]['flag'];
    }else{
      this.flag = "assets/img/flags/flag-little/flag-black.png";
    }
  }

}
