import { Component, OnInit, ViewChild } from '@angular/core';
declare const $: any;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConsultaService } from './consulta.service'

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
import { LiquidacionesService } from '../liquidaciones/liquidaciones.service';
import { ShowLiquidacionesComponent } from '../liquidaciones/show-liquidaciones/show-liquidaciones.component';


@Component({
standalone: false,
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  vmButtons: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;


  /*variables del detalle de liquidación*/
  importPed: any = {
    fk_pais: 54, fecha_liq: new Date(), fecha_llegada: new Date(), tip_transp: 0, tipo_carga: 0, total_gasto: parseFloat('0.00').toFixed(4), total_items: parseFloat('0.00').toFixed(4),
    total_transp: parseFloat('0.00').toFixed(4), puerto_salida: null, name_transp: null, inspeccion: null, contenedor_cat: parseFloat('0.00').toFixed(4),
    cap_peso: parseFloat('0.00').toFixed(4), cap_vol: parseFloat('0.00').toFixed(4), prt_llegada: null, bl: null, num_dai: null, observacion: "",
    total_seguro: parseFloat('0.00').toFixed(4), total_fob: parseFloat('0.00').toFixed(4), total_general: parseFloat('0.00').toFixed(4), total_arancel: parseFloat('0.00').toFixed(4)
  };
  arrayCountrys: any;
  dataUser: any;
  permisions: any;
  pedido: any = 0;
  arrayPedidos: any;
  dataProducto: any = [];
  dataProductoAux: any = [];
  dataProCierre: any = [];
  pedidosGlobales: any = [];
  numSec: any;
  secGlobal: any;
  btnVal: any = false;
  dsbGlb: any = false;
  btnValtr: any = false;
  btnValDet: any = false;
  btnValCierre: any = false;
  totalesXProductos: any = { total_valor: parseFloat('0.00').toFixed(4), total_peso: parseFloat('0.00').toFixed(4), total_volumen: parseFloat('0.00').toFixed(4) };
  totalesXProductosTransp: any = { total_valor: parseFloat('0.00').toFixed(4), total_peso: parseFloat('0.00').toFixed(4), total_volumen: parseFloat('0.00').toFixed(4) };
  totalesXProductosCierre: any = {
    total_valor: parseFloat('0.00').toFixed(4), total_gasto: parseFloat('0.00').toFixed(4),
    total_arancel: parseFloat('0.00').toFixed(4), total_cif: parseFloat('0.00').toFixed(4)
  };

  totalesViews: any = {
    tgt: parseFloat('0.00').toFixed(4), total_transp: parseFloat('0.00').toFixed(4),
    ts: parseFloat('0.00').toFixed(4), tf: parseFloat('0.00').toFixed(4),
    tgn: parseFloat('0.00').toFixed(4)
  };
  validaStatus: any = false;
  factor_transp: any = "0";
  prefijo: any = "";
  base_transp: any = parseFloat('0.00').toFixed(4);
  valUdp: any = false;
  arrayViewsGastosImp: any = [];
  totalGastos: any = parseFloat('0.00').toFixed(4);
  valCierre: any = false;
  arrayAranceles: any;
  valLiquiCerrada: any = false;
  rubrosObligatorio: any;
  arrayRubros: any;
  rubrosFaltantes: any;
  processingtwo: any = false;
  flag: any = "assets/img/flags/flag-little/flag-black.png";
  filter: any = "Liquidado";
  hoy: Date = new Date;
  fromDatePickerFilter: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  toDatePickerFilter: Date = new Date();


  constructor(
    private liqSrv: LiquidacionesService,
    private ConSrv: ConsultaService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private socket: Socket
  ) {

    this.commonVarSrv.cancelImpLiqui.asObservable().subscribe(res => {
      this.cancel();
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

  }

  ngOnInit(): void {

    $('#divListaLiquidacion').collapse("show");
    $('#divLiquiCloset').collapse("hide");

    this.vmButtons = [
      { orig: "btnsConsLiq", paramAccion: "", boton: { icon: "fas fa-list", texto: "VER LISTA LIQUIDACIONES" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
      this.vmButtons[0].permiso = false;
      this.vmButtons[0].showimg = false;

      /* this.vmButtons[1].permiso = true;
      this.vmButtons[1].showimg = true; */

      this.getPermisions();
    }, 10);
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.validaDt = true;
    this.dataDT = [];
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableAccounts();
    });
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      filter: this.filter,
      desde: moment(this.fromDatePickerFilter).format('YYYY-MM-DD'),
      hasta: moment(this.toDatePickerFilter).format('YYYY-MM-DD')
    }

    this.ConSrv.getLiquidacionesCloset(data)
      .subscribe(res => {

        this.dataDT = res['data'];
        this.dataDT.forEach(element => {
          element['total'] = parseFloat(element['total']).toFixed(2);
        });
        this.validaDt = true;
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      });
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fConsultaLiquidaciones,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de liquidación de importaciones");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getAranceles();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAranceles() {
    this.liqSrv.getAvailableAranceles().subscribe(res => {
      this.arrayAranceles = res["data"];
      this.getCurrencys();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCurrencys() {
    this.liqSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data'];
      this.getPedidoscerrados();
      this.changeFlag();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getPedidoscerrados() {
    this.liqSrv.getPedidosCerradosLiq().subscribe(res => {
      this.arrayPedidos = res['data'];
      this.getSecuencia();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSecuencia() {
    let data = {
      id: [30]
    }
    this.liqSrv.getSecuencia(data).subscribe(res => {
      this.secGlobal = res['data'];
      this.numSec = res['data'][0]['codigo'] + "-" + res['data'][0]['secuencia'].toString().padStart(10, '0');
      this.getTipoRubross();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  getTipoRubross() {
    this.rubrosObligatorio = [];
    this.liqSrv.getTipoRubross().subscribe(res => {
      this.arrayRubros = res['data'];
      this.arrayRubros.forEach(element => {
        element['detalle'].forEach(elm => {
          if (elm['obligatorio'] == 1 && elm['tipo_gasto'] == "Liquidacion" && elm['acumula_en'] == "TRANSPORTE") { this.rubrosObligatorio.push(elm); }
        });
      });
      this.getTableAccounts();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeStatus() {
    this.btnVal = !this.btnVal;
  }

  changeStatusTr() {
    this.btnValtr = !this.btnValtr;
  }

  changeStatusDet() {
    this.btnValDet = !this.btnValDet;
  }

  changeStatusCiere() {
    this.btnValCierre = !this.btnValCierre;
  }

  addPedido() {
    this.importPed.total_items = parseFloat('0.00');
    let producto = {};
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if (this.pedidosGlobales.length > 0) {
        this.importPed.total_transp = parseFloat('0.00');
        this.importPed.total_fob = parseFloat('0.00');
        this.importPed.total_seguro = parseFloat('0.00');
        producto = this.arrayPedidos.filter(e => e.id == this.pedido)[0];
        let validt = false;
        this.pedidosGlobales.forEach(element => {
          if (element.id == this.pedido) { validt = true; }
        });
        if (validt) {
          Swal.fire(
            'Atención!',
            'Este pedido ya se encuenta ingresado!',
            'error'
          )
        } else {
          this.dataProducto = [];
          this.pedidosGlobales.push(producto);
          this.pedidosGlobales.forEach(element => {
            this.importPed.total_transp += parseFloat(element['total_transp']);
            this.importPed.total_fob += parseFloat(element['total_fob_pedido']);
            this.importPed.total_seguro += parseFloat(element['total_seguro']);
            element['detalle'].forEach(elm => {
              elm['num_ped'] = element['num_doc'];
              this.dataProducto.push(elm);
            });
          });
        }
      } else {
        this.importPed.total_transp = parseFloat('0.00');
        this.importPed.total_fob = parseFloat('0.00');
        this.importPed.total_seguro = parseFloat('0.00');
        this.dataProducto = [];
        producto = this.arrayPedidos.filter(e => e.id == this.pedido)[0];
        this.pedidosGlobales.push(producto);
        this.pedidosGlobales.forEach(element => {
          this.importPed.total_transp += parseFloat(element['total_transp']);
          this.importPed.total_fob += parseFloat(element['total_fob_pedido']);
          this.importPed.total_seguro += parseFloat(element['total_seguro']);
          element['detalle'].forEach(elm => {
            elm['num_ped'] = element['num_doc'];
            this.dataProducto.push(elm);
          });
        });
      }
      this.pedido = 0;
      this.totalesXProductos.total_valor = parseFloat('0.00');
      this.totalesXProductos.total_peso = parseFloat('0.00');
      this.totalesXProductos.total_volumen = parseFloat('0.00');
      this.dataProducto.forEach(element => {
        this.totalesXProductos.total_valor += parseFloat(element['total_fob']);
        this.totalesXProductos.total_peso += parseFloat(element['peso']);
        this.totalesXProductos.total_volumen += parseFloat(element['volumen']);
        this.importPed.total_items = parseFloat(this.importPed.total_items) + parseFloat(element['cantidad_recibida']);
        this.importPed.total_items = this.importPed.total_items.toFixed(4);
      });
      this.importPed['total_general'] = parseFloat(this.importPed['total_fob']) + parseFloat(this.importPed['total_gasto']) + parseFloat(this.importPed['total_seguro']) + parseFloat(this.importPed['total_transp']);
      this.importPed['total_general'] = parseFloat(this.importPed['total_general']).toFixed();
      this.importPed.total_transp = parseFloat(this.importPed.total_transp).toFixed(4);
      this.importPed.total_fob = parseFloat(this.importPed.total_fob).toFixed(4);
      this.importPed.total_seguro = parseFloat(this.importPed.total_seguro).toFixed(4);

      this.totalesViews.tgt = parseFloat(this.importPed.total_gasto);
      this.totalesViews.total_transp = parseFloat(this.importPed.total_transp);
      this.totalesViews.ts = parseFloat(this.importPed.total_seguro);
      this.totalesViews.tf = parseFloat(this.importPed.total_fob);
      this.totalesViews.tgn = parseFloat(this.totalesViews.tgt) + parseFloat(this.totalesViews.total_transp) + parseFloat(this.totalesViews.ts) + parseFloat(this.totalesViews.tf) + parseFloat(this.totalesXProductosCierre.total_arancel);
    }
  }

  deletePedido() {
    this.importPed.total_items = parseFloat('0.00');
    let producto = [];
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (this.pedidosGlobales.length > 0) {
        producto = this.pedidosGlobales.filter(e => e.id == this.pedido);
        if (producto.length > 0) {
          producto = [];
          producto = this.pedidosGlobales.filter(e => e.id != this.pedido);
          this.importPed.total_transp = parseFloat('0.00');
          this.importPed.total_fob = parseFloat('0.00');
          this.importPed.total_seguro = parseFloat('0.00');
          this.pedidosGlobales = [];
          this.dataProducto = [];
          this.pedidosGlobales = producto;
          this.pedidosGlobales.forEach(element => {
            this.importPed.total_transp += parseFloat(element['total_transp']);
            this.importPed.total_fob += parseFloat(element['total_fob_pedido']);
            this.importPed.total_seguro += parseFloat(element['total_seguro']);
            element['detalle'].forEach(elm => {
              this.dataProducto.push(elm);
            });
          });
        } else {
          Swal.fire(
            'Atención!',
            'Este pedido no ha sido ingresado en la lista!',
            'error'
          )
        }
      } else {
        Swal.fire(
          'Atención!',
          'No existen pedidos ingresados!',
          'error'
        )
      }
      this.pedido = 0;
      this.totalesXProductos.total_valor = parseFloat('0.00');
      this.totalesXProductos.total_peso = parseFloat('0.00');
      this.totalesXProductos.total_volumen = parseFloat('0.00');
      this.dataProducto.forEach(element => {
        this.totalesXProductos.total_valor += parseFloat(element['total_fob']);
        this.totalesXProductos.total_peso += parseFloat(element['peso']);
        this.totalesXProductos.total_volumen += parseFloat(element['volumen']);
        this.importPed.total_items = parseFloat(this.importPed.total_items) + parseFloat(element['cantidad_recibida']);
        this.importPed.total_items = this.importPed.total_items.toFixed(4);
      });
      this.importPed['total_general'] = parseFloat(this.importPed['total_fob']) + parseFloat(this.importPed['total_gasto']) + parseFloat(this.importPed['total_seguro']) + parseFloat(this.importPed['total_transp']);
      this.importPed['total_general'] = parseFloat(this.importPed['total_general']).toFixed(4);
      this.importPed.total_transp = parseFloat(this.importPed.total_transp).toFixed(4);
      this.importPed.total_fob = parseFloat(this.importPed.total_fob).toFixed(4);
      this.importPed.total_seguro = parseFloat(this.importPed.total_seguro).toFixed(4);
    }
  }

  changeContainer(evt) {
    if (evt != 0) {
      this.importPed.contenedor_cat = (evt == "FCL") ? parseFloat('1').toFixed(4) : parseFloat('0.00').toFixed(4);
    } else {
      this.importPed.contenedor_cat = parseFloat('0.00').toFixed(4);
    }
  }

  cancel() {
    this.rubrosFaltantes = [];
    this.rubrosObligatorio = [];
    document.getElementById("collapseTransporte").classList.remove('show')
    document.getElementById("collapseDetalleGasto").classList.remove('show');
    document.getElementById("collapseCierre").classList.remove('show');
    document.getElementById("collapseExample").classList.remove('show');
    this.importPed = {
      fk_pais: 54, fecha_liq: new Date(), fecha_llegada: new Date(), tip_transp: 0, tipo_carga: 0, total_gasto: parseFloat('0.00').toFixed(4), total_items: parseFloat('0.00').toFixed(4),
      total_transp: parseFloat('0.00').toFixed(4), puerto_salida: null, name_transp: null, inspeccion: null, contenedor_cat: parseFloat('0.00').toFixed(4),
      cap_peso: parseFloat('0.00').toFixed(4), cap_vol: parseFloat('0.00').toFixed(4), prt_llegada: null, bl: null, num_dai: null, observacion: "",
      total_seguro: parseFloat('0.00').toFixed(4), total_fob: parseFloat('0.00').toFixed(4), total_general: parseFloat('0.00').toFixed(4), total_arancel: parseFloat('0.00').toFixed(4)
    };
    this.totalesXProductos = { total_valor: parseFloat('0.00').toFixed(4), total_peso: parseFloat('0.00').toFixed(4), total_volumen: parseFloat('0.00').toFixed(4) };
    this.totalesXProductosTransp = { total_valor: parseFloat('0.00').toFixed(4), total_peso: parseFloat('0.00').toFixed(4), total_volumen: parseFloat('0.00').toFixed(4) };
    this.totalesXProductosCierre = {
      total_valor: parseFloat('0.00').toFixed(4), total_gasto: parseFloat('0.00').toFixed(4),
      total_arancel: parseFloat('0.00').toFixed(4), total_cif: parseFloat('0.00').toFixed(4)
    };
    this.totalesViews = {
      tgt: parseFloat('0.00').toFixed(4), total_transp: parseFloat('0.00').toFixed(4),
      ts: parseFloat('0.00').toFixed(4), tf: parseFloat('0.00').toFixed(4),
      tgn: parseFloat('0.00').toFixed(4)
    };
    this.pedido = 0;
    this.arrayPedidos = [];
    this.dataProducto = [];
    this.dataProductoAux = [];
    this.dataProCierre = [];
    this.pedidosGlobales = [];
    this.btnVal = false;
    this.dsbGlb = false;
    this.btnValtr = false;
    this.btnValDet = false;
    this.btnValCierre = false;
    this.validaStatus = false;
    this.factor_transp = "0";
    this.prefijo = "";
    this.base_transp = parseFloat('0.00').toFixed(4);
    this.valUdp = false;
    this.arrayViewsGastosImp = [];
    this.totalGastos = parseFloat('0.00').toFixed(4);
    this.valCierre = false;
    /* this.arrayAranceles = []; */
    this.valLiquiCerrada = false;
    this.getPedidoscerrados();
  }

  async validateSaveLiqImp() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la liquidación?", "SAVE_LIQUIDACION");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.importPed.fk_pais == 0) {
        this.toastr.info("Seleccione un país");
      } else if (this.importPed.tip_transp == 0) {
        this.toastr.info("Seleccione tipo de transporte");
      } else if (this.importPed.tipo_carga == 0) {
        this.toastr.info("Seleccione un tipo de carga");
      } else if (this.importPed.name_transp == null || this.importPed.name_transp == "") {
        this.toastr.info("Ingrese nombre de transporte");
        document.getElementById("idNametrp").focus(); return;
      } else if (this.importPed.inspeccion == null || this.importPed.inspeccion == "") {
        this.toastr.info("Ingrese inspección");
        document.getElementById("idImpec").focus(); return;
      } else if (this.importPed.contenedor_cat == 0 || this.importPed.contenedor_cat == "") {
        this.toastr.info("Ingrese cantidad de contenedores");
        document.getElementById("idCtdCtn").focus(); return;
      } else if (this.importPed.cap_peso == 0 || this.importPed.cap_peso == "") {
        this.toastr.info("Ingrese capacidad de peso en kilogramos");
        document.getElementById("idCpcPeso").focus(); return;
      } else if (this.importPed.cap_vol == 0 || this.importPed.cap_vol == "") {
        this.toastr.info("Ingrese capacidad de volumen en metros cúbicos");
        document.getElementById("idCpcVol").focus(); return;
      } else if (this.importPed.num_dai == "" || this.importPed.num_dai == null) {
        this.toastr.info("Ingrese número de dai");
        document.getElementById("idnumDai").focus(); return;
      } else if (this.importPed.puerto_salida == null || this.importPed.puerto_salida == "") {
        this.toastr.info("Ingrese puerto de salida");
        document.getElementById("idprtSalida").focus(); return;
      } else if (this.importPed.prt_llegada == null || this.importPed.prt_llegada == "") {
        this.toastr.info("Ingrese puerto de llegada");
        document.getElementById("idPrtll").focus(); return;
      } else if (this.importPed.bl == null || this.importPed.bl == "") {
        this.toastr.info("Ingrese B/L");
        document.getElementById("idbl").focus(); return;
      } else if (this.pedidosGlobales.length == 0) {
        this.toastr.info("Seleccione al menos un pedido para esta liquidación");
      } else {
        resolve(true);
      }
    });
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
        if (action == "SAVE_LIQUIDACION") {
          this.saveLiquidacion();
        } else if (action == "UPDATE_LIQUIDACION") {
          this.updateLiquidacion();
        } else if (action == "CERRAR_LIQUIDACION") {
          this.updateLiquidacionCierre();
        }
      }
    })
  }

  saveLiquidacion() {
    this.lcargando.ctlSpinner(true);
    this.importPed['fecha_liq'] = moment(this.importPed.fecha_liq).format('YYYY-MM-DD');
    this.importPed['fecha_llegada'] = moment(this.importPed.fecha_llegada).format('YYYY-MM-DD');
    this.importPed['detalle_pedidos'] = this.pedidosGlobales;
    this.importPed['detalle_productos'] = this.dataProducto;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Creación de Liquidación de pedidos de importación número ${this.secGlobal[0]['secuencia']}, por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fImpLiquidacion;
    this.importPed['estado'] = "Pendiente";
    this.importPed['fk_tip_doc'] = this.secGlobal[0].id;
    this.importPed['num_doc'] = this.secGlobal[0].secuencia;
    this.importPed['cantidad_pedidos'] = this.pedidosGlobales.length;
    this.importPed['fk_empresa'] = this.dataUser.id_empresa;
    this.importPed['fk_user_liq'] = this.dataUser.id_usuario;

    this.liqSrv.saveLiquidacion(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  showLiquidaciones() {
    const modalInvoice = this.modalService.open(ShowLiquidacionesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fImpLiquidacion;
    modalInvoice.componentInstance.editar = this.permisions.eliminar;
    this.cancel();
  }

  calculated(evt) {
    if (evt != "0" && (this.importPed.total_seguro > 0 && this.importPed.total_transp > 0)) {
      this.totalesXProductosTransp.total_valor = parseFloat('0.00');
      this.totalesXProductosTransp.total_peso = parseFloat('0.00');
      this.totalesXProductosTransp.total_volumen = parseFloat('0.00');
      if (this.factor_transp == "Valor") {
        this.base_transp = parseFloat(this.totalesXProductos.total_valor).toFixed(4);
        this.prefijo = " ($)"
        this.calculteXValor();
      } else if (this.factor_transp == "Volumen") {
        this.base_transp = parseFloat(this.totalesXProductos.total_volumen).toFixed(4);
        this.prefijo = " (m^3)"
        this.calculteXVolumen();
      } else {
        this.base_transp = parseFloat(this.totalesXProductos.total_peso).toFixed(4);
        this.prefijo = " (Kg)"
        this.calculteXPeso();
      }
    } else {
      Swal.fire({
        title: 'Error!!',
        text: "Para hacer este calculo debe ingresar los gastos de Seguro y Transporte obligatoriamente o asegúrese de haber seleccinado un metodo de costeo!!",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    }
  }

  calculteXValor() {
    this.dataProductoAux.forEach(element => {
      element['transp_por'] = parseFloat('0.00');
      element['transp_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_valor), parseFloat(element.fobAux));
      element['transp_valor'] = this.getReglaDeTresValor(parseFloat(element['transp_por']), parseFloat(this.importPed.total_transp));
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(parseFloat(element['transp_por']), parseFloat(this.importPed.total_transp))) + parseFloat(element['fobAux']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      element['segu_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_valor), parseFloat(element.fobAux));
      element['segu_valor'] = this.getReglaDeTresValor(parseFloat(element['segu_por']), parseFloat(this.importPed.total_seguro));
      element['total_fob'] = parseFloat(element['total_fob']) + parseFloat(element['segu_valor']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      this.totalesXProductosTransp.total_valor += parseFloat(element['total_fob']);
      this.totalesXProductosTransp.total_peso += parseFloat(element['peso']);
      this.totalesXProductosTransp.total_volumen += parseFloat(element['volumen']);
    });

    this.totalesXProductosTransp.total_valor = parseFloat(this.totalesXProductosTransp.total_valor).toFixed(4);
    this.totalesXProductosTransp.total_peso = parseFloat(this.totalesXProductosTransp.total_peso).toFixed(4);
    this.totalesXProductosTransp.total_volumen = parseFloat(this.totalesXProductosTransp.total_volumen).toFixed(4);

  }

  calculteXVolumen() {
    this.dataProductoAux.forEach(element => {
      element['transp_por'] = parseFloat('0.00');
      element['transp_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_volumen), parseFloat(element.volumen));
      element['transp_valor'] = this.getReglaDeTresValor(parseFloat(element['transp_por']), parseFloat(this.importPed.total_transp));
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['transp_por'], this.importPed.total_transp)) + parseFloat(element['fobAux']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      element['segu_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_valor), parseFloat(element.fobAux));
      element['segu_valor'] = this.getReglaDeTresValor(parseFloat(element['segu_por']), parseFloat(this.importPed.total_seguro));
      element['total_fob'] = parseFloat(element['total_fob']) + parseFloat(element['segu_valor']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      this.totalesXProductosTransp.total_valor += parseFloat(element['total_fob']);
      this.totalesXProductosTransp.total_peso += parseFloat(element['peso']);
      this.totalesXProductosTransp.total_volumen += parseFloat(element['volumen']);
    });

    this.totalesXProductosTransp.total_valor = parseFloat(this.totalesXProductosTransp.total_valor).toFixed(4);
    this.totalesXProductosTransp.total_peso = parseFloat(this.totalesXProductosTransp.total_peso).toFixed(4);
    this.totalesXProductosTransp.total_volumen = parseFloat(this.totalesXProductosTransp.total_volumen).toFixed(4);

  }

  calculteXPeso() {
    this.dataProductoAux.forEach(element => {
      element['transp_por'] = parseFloat('0.00');
      element['transp_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_peso), parseFloat(element.peso));
      element['transp_valor'] = this.getReglaDeTresValor(parseFloat(element['transp_por']), parseFloat(this.importPed.total_transp));
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(parseFloat(element['transp_por']), parseFloat(this.importPed.total_transp))) + parseFloat(element['fobAux']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      element['segu_por'] = this.getReglaDeTresPorcentaje(parseFloat(this.totalesXProductos.total_valor), parseFloat(element.fobAux));
      element['segu_valor'] = this.getReglaDeTresValor(parseFloat(element['segu_por']), parseFloat(this.importPed.total_seguro));
      element['total_fob'] = parseFloat(element['total_fob']) + parseFloat(element['segu_valor']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);

      this.totalesXProductosTransp.total_valor += parseFloat(element['total_fob']);
      this.totalesXProductosTransp.total_peso += parseFloat(element['peso']);
      this.totalesXProductosTransp.total_volumen += parseFloat(element['volumen']);
    });

    this.totalesXProductosTransp.total_valor = parseFloat(this.totalesXProductosTransp.total_valor).toFixed(4);
    this.totalesXProductosTransp.total_peso = parseFloat(this.totalesXProductosTransp.total_peso).toFixed(4);
    this.totalesXProductosTransp.total_volumen = parseFloat(this.totalesXProductosTransp.total_volumen).toFixed(4);
  }

  getReglaDeTresValor(val1, val2) {
    let result = 0;
    result = val1 * val2;
    result = result / 100;
    return parseFloat(result.toString()).toFixed(4);
  }

  getReglaDeTresPorcentaje(val1, val2) {
    let result = 0;
    result = 100 * val2;
    result = result / val1;
    return parseFloat(result.toString()).toFixed(4);
  }

  async validateUpdatedLiqImp() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      if (this.factor_transp == "0") {
        this.toastr.info('Debe seleccionar un método de costeo');
      } else {
        this.confirmSave("Seguro desea actualizar la liquidación?", "UPDATE_LIQUIDACION");
      }
    }
  }

  updateLiquidacion() {
    this.lcargando.ctlSpinner(true);
    this.importPed['detalle_productos'] = this.dataProductoAux;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Actualización de Liquidación de pedidos número ${this.importPed.num_doc}, para calcular valor de transporte de importación por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fImpLiquidacion;
    this.importPed['factor_transp'] = this.factor_transp;
    this.importPed['total_transp'] = parseFloat(this.totalesViews.total_transp);
    this.importPed['base_transp'] = parseFloat(this.base_transp);
    this.importPed['estado'] = "Procesado";
    this.importPed['total_seguro'] = parseFloat(this.totalesViews.ts);
    this.importPed['total_gasto'] = parseFloat(this.totalesViews.tgt);
    this.importPed['total_general'] = parseFloat(this.totalesViews.tgn);

    this.liqSrv.updateLiquidacion(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  calculaArancelCierre() {
    let valueFinal = parseFloat('0.00');
    this.totalesXProductosCierre.total_valor = parseFloat('0.00');
    this.totalesXProductosCierre.total_gasto = parseFloat('0.00');
    this.totalesXProductosCierre.total_arancel = parseFloat('0.00');
    this.totalesXProductosCierre.total_cif = parseFloat('0.00');

    this.dataProCierre.forEach(element => {
      element['arancel_partida_val'] = this.getReglaDeTresValor(parseFloat(element['partida_por']), parseFloat(element.total_cif));
      element['total_cif_cierre'] = parseFloat(this.getReglaDeTresValor(parseFloat(element['partida_por']), parseFloat(element.total_cif))) + parseFloat(element['total_cif']);
      element['cif_cierre'] = parseFloat(element['total_cif_cierre']) / parseFloat(element['cantidad_recibida']);
      element['arancel_partida_val'] = parseFloat(element['arancel_partida_val']).toFixed(4);
      element['total_cif_cierre'] = parseFloat(element['total_cif_cierre']).toFixed(4);
      element['cif_cierre'] = parseFloat(element['cif_cierre']).toFixed(4);

      valueFinal += parseFloat(element['total_cif_cierre']);
      this.totalesXProductosCierre.total_valor += parseFloat(element['total_cif_cierre']);
      this.totalesXProductosCierre.total_gasto += parseFloat(element['val_gt_liq']);
      this.totalesXProductosCierre.total_arancel += parseFloat(element['arancel_partida_val']);
      this.totalesXProductosCierre.total_cif += parseFloat(element['total_cif']);
    });

    this.totalesXProductosCierre.total_valor = parseFloat('0.00');
    this.totalesXProductosCierre.total_gasto = parseFloat('0.00');
    this.totalesXProductosCierre.total_arancel = parseFloat('0.00');
    this.totalesXProductosCierre.total_cif = parseFloat('0.00');

    this.dataProCierre.forEach(elm => {
      elm['ptg_gt_liq'] = this.getReglaDeTresPorcentaje(parseFloat(valueFinal.toString()), parseFloat(elm.total_cif_cierre));
      elm['val_gt_liq'] = this.getReglaDeTresValor(parseFloat(elm['ptg_gt_liq']), parseFloat(this.importPed.total_gasto));
      elm['total_cif_cierre'] = parseFloat(this.getReglaDeTresValor(parseFloat(elm['ptg_gt_liq']), parseFloat(this.importPed.total_gasto))) + parseFloat(elm['total_cif_cierre']);
      elm['cif_cierre'] = parseFloat(elm['total_cif_cierre']) / parseFloat(elm['cantidad_recibida']);

      elm['total_cif_cierre'] = parseFloat(elm['total_cif_cierre']).toFixed(4);
      elm['cif_cierre'] = parseFloat(elm['cif_cierre']).toFixed(4);
      elm['ptg_gt_liq'] = parseFloat(elm['ptg_gt_liq']).toFixed(4);
      elm['val_gt_liq'] = parseFloat(elm['val_gt_liq']).toFixed(4);

      this.totalesXProductosCierre.total_valor += parseFloat(elm['total_cif_cierre']);
      this.totalesXProductosCierre.total_gasto += parseFloat(elm['val_gt_liq']);
      this.totalesXProductosCierre.total_arancel += parseFloat(elm['arancel_partida_val']);
      this.totalesXProductosCierre.total_cif += parseFloat(elm['total_cif']);
    });


    this.totalesXProductosCierre.total_valor = parseFloat(this.totalesXProductosCierre.total_valor).toFixed(4);
    this.totalesXProductosCierre.total_gasto = parseFloat(this.totalesXProductosCierre.total_gasto).toFixed(4);
    this.totalesXProductosCierre.total_arancel = parseFloat(this.totalesXProductosCierre.total_arancel).toFixed(4);
    this.totalesXProductosCierre.total_cif = parseFloat(this.totalesXProductosCierre.total_cif).toFixed(4);

    this.totalesViews.tgn = parseFloat(this.totalesViews.tgt) + parseFloat(this.totalesViews.total_transp) + parseFloat(this.totalesViews.ts) + parseFloat(this.totalesViews.tf) + parseFloat(this.totalesXProductosCierre.total_arancel);
    this.totalesViews.tgn = parseFloat(this.totalesViews.tgn).toFixed(4);

  }

  changePartida(i, evt) {
    let partida = [];
    partida = this.arrayAranceles.filter(e => e.codigo == evt);
    if (partida.length > 0) {
      document.getElementById("id_partida" + i).blur();
      this.dataProCierre = JSON.parse(localStorage.getItem('cierreLiquidacion'));
      this.dataProCierre[i]['partida_cod'] = partida[0]['codigo'];
      this.dataProCierre[i]['partida_por'] = partida[0]['tarifa_arancelaria'];
      this.calculaArancelCierre();
    }
  }

  async validateCierreLiqImp() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {

      this.rubrosFaltantes = [];
      let rubro = [];
      this.rubrosObligatorio.forEach(element => {
        rubro = [];
        rubro = this.arrayViewsGastosImp.filter(e => e.fk_rubro_det == element.id);
        if (rubro.length > 0) {
          this.rubrosFaltantes.push(element['nombre']);
        }
      });
      if (this.rubrosObligatorio.length == 0) {
        Swal.fire({
          title: 'Error!!',
          text: "Es obligatorio al menos un gasto de transporte para la liquidación",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else if (this.rubrosFaltantes.length == 0 && this.rubrosObligatorio.length > 0) {
        Swal.fire({
          title: 'Error!!',
          text: "Faltan gastos que son obligatorios: " + this.rubrosObligatorio,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else if (this.rubrosFaltantes.length > 0) {
        this.confirmSave("Seguro desea cerrar la liquidación?", "CERRAR_LIQUIDACION");
      }
    }
  }

  updateLiquidacionCierre() {
    this.lcargando.ctlSpinner(true);
    this.importPed['detalle_productos_cierre'] = this.dataProCierre;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Cierre de Liquidación de pedidos número ${this.importPed.num_doc}, para calcular arancel y gastos, por el usuario ${this.dataUser.nombre}`;
    this.importPed['id_controlador'] = myVarGlobals.fImpLiquidacion;
    this.importPed['estado'] = "Liquidado";
    this.importPed['total_gasto'] = parseFloat(this.totalesViews.tgt);
    this.importPed['total_general'] = parseFloat(this.totalesViews.tgn);
    this.importPed['total_arancel'] = parseFloat(this.totalesXProductosCierre.total_arancel);

    this.liqSrv.updateLiquidacionCierre(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  closeModalLiqui() {
    ($("#modalLiquidaReport") as any).modal("hide");
    this.processingtwo = false;
  }

  reportModalLiquidacion() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Liquidaciones Pedido");
    } else {
      $('#modalLiquidaReport').appendTo("body").modal('show');
      this.processingtwo = true;
    }
  }

  changeFlag() {
    if (this.importPed.fk_pais != 0) {
      this.flag = this.arrayCountrys.filter(e => e.id == this.importPed.fk_pais)[0]['flag'];
    } else {
      this.flag = "assets/img/flags/flag-little/flag-black.png";
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "VER LISTA LIQUIDACIONES":
        this.vmButtons[0].permiso = false;
        this.vmButtons[0].showimg = false;

        /* this.vmButtons[1].permiso = true;
        this.vmButtons[1].showimg = true; */

        $('#divListaLiquidacion').collapse("show");
        $('#divLiquiCloset').collapse("hide");

        break;
      case "VER DETALLE":
        this.vmButtons[0].permiso = true;
        this.vmButtons[0].showimg = true;

        /* this.vmButtons[1].permiso = false;
        this.vmButtons[1].showimg = false; */

        $('#divLiquiCloset').collapse("show");
        $('#divListaLiquidacion').collapse("hide");

        break;
    }
  }

  showDetalleLiq(dt) {
    this.vmButtons[0].permiso = true;
    this.vmButtons[0].showimg = true;

    $('#divLiquiCloset').collapse("show");
    $('#divListaLiquidacion').collapse("hide");

    this.valCierre = false;
    this.valLiquiCerrada = false;
    if (!this.dsbGlb) {
      this.importPed = {};
      this.dsbGlb = true;
      this.importPed.total_gasto = parseFloat('0.00');
      this.importPed.total_transp = parseFloat('0.00');
      this.importPed.total_fob = parseFloat('0.00');
      this.importPed.total_seguro = parseFloat('0.00');
      this.importPed.total_general = parseFloat('0.00');
      this.importPed = dt;
      this.changeFlag();
      this.factor_transp = this.importPed.factor_transp;
      this.base_transp = this.importPed.base_transp;
      (this.factor_transp != 0 && this.base_transp != 0) ? this.valUdp = true : this.valUdp = false;
      this.numSec = this.secGlobal[0]['codigo'] + "-" + dt.num_doc.toString().padStart(10, '0');
      this.dataProducto = dt.detalle;
      this.dataProductoAux = dt.detalle_aux;
      document.getElementById("collapseExample").classList.add('show');
      if ((this.factor_transp != 0 && this.base_transp != 0) || (this.importPed.total_transp == 0 && this.importPed.total_seguro == 0)) { document.getElementById("collapseTransporte").classList.add('show') };

      this.totalesXProductos.total_valor = parseFloat('0.00');
      this.totalesXProductos.total_peso = parseFloat('0.00');
      this.totalesXProductos.total_volumen = parseFloat('0.00');

      this.totalesXProductosTransp.total_valor = parseFloat('0.00');
      this.totalesXProductosTransp.total_peso = parseFloat('0.00');
      this.totalesXProductosTransp.total_volumen = parseFloat('0.00');

      this.dataProductoAux.forEach(element => {
        this.totalesXProductos.total_valor += parseFloat(element['total_fob']);
        this.totalesXProductos.total_peso += parseFloat(element['peso']);
        this.totalesXProductos.total_volumen += parseFloat(element['volumen']);

        this.totalesXProductosTransp.total_valor += parseFloat(element['total_fob']);
        this.totalesXProductosTransp.total_peso += parseFloat(element['peso']);
        this.totalesXProductosTransp.total_volumen += parseFloat(element['volumen']);

        element['transp_valor'] = parseFloat('0.00');
        element['transp_por'] = parseFloat('0.00');
        element['fobAux'] = parseFloat(element['total_fob']);
      });

      this.importPed['total_general'] = parseFloat(dt['total_general']);
      this.importPed.total_gasto = parseFloat(dt.total_gasto);
      this.importPed.total_fob = parseFloat(dt.total_fob);
      this.importPed.total_seguro = parseFloat(dt.total_seguro);

      if (this.importPed.total_transp == 0 && this.importPed.total_seguro == 0) {
        if (dt['gastos'] != undefined) {
          dt['gastos'].forEach(element => {
            if (element['grupo_gasto']['detalle'][0]['acumula_en'] == "TRANSPORTE") {
              this.importPed.total_transp = parseFloat(this.importPed.total_transp) + parseFloat(element.total);
            } else if (element['grupo_gasto']['detalle'][0]['acumula_en'] == "SEGURO") {
              this.importPed.total_seguro = parseFloat(this.importPed.total_gasto) + parseFloat(element.total);
            }
          });
        }
      } else {
        this.dataProCierre = [];
        this.dataProCierre = dt.detalle_cierre;
        localStorage.setItem('cierreLiquidacion', JSON.stringify(this.dataProCierre));
        this.arrayViewsGastosImp = [];
        document.getElementById("collapseDetalleGasto").classList.add('show');
        this.totalGastos = parseFloat('0.00');
        let objGastos = {};
        if (dt['gastos'] != undefined) {
          dt['gastos'].forEach(element => {
            objGastos = {};
            this.totalGastos = parseFloat(this.totalGastos) + parseFloat(element.total)
            element['detalle'].forEach(elm => {
              objGastos['nombre'] = elm['nombre'];
              objGastos['acumula'] = elm['acumula_en'];
              objGastos['num_doc_gasto'] = (element['num_doc_gasto'] == null) ? "N/A" : element['num_doc_gasto'];
              objGastos['num_pedido'] = element['fk_ped_liq'];;
              objGastos['type'] = (element.aplica_a == 'Pedido') ? "Local" : "Importación";
              objGastos['value'] = element['total'];
              objGastos['type_payment'] = element['tipo_pago'];
              objGastos['forma_payment'] = element['forma_pago'];
              objGastos['fecha'] = element['fecha'];
              objGastos['estado'] = element['estado'];
              objGastos['obigatorio'] = elm['obligatorio'];
              objGastos['type_acumula'] = elm['type_acumula'];
              objGastos['fk_rubro_det'] = elm['fk_rubro_det'];
            });
            this.arrayViewsGastosImp.push(objGastos);
          });
        }
        /*aqui obtengo los gastos para el cierre*/
        if (this.importPed.total_gasto == 0) {
          this.valCierre = true;
          this.valLiquiCerrada = false;
          document.getElementById("collapseCierre").classList.add('show');
          this.arrayViewsGastosImp.forEach(element => {
            if (element.acumula == "GASTOS" && element.type_acumula != "N/A") {
              this.importPed.total_gasto = parseFloat(this.importPed.total_gasto) + parseFloat(element.value);
            }
          });
          this.calculaArancelCierre();
        } else {
          this.valCierre = true;
          document.getElementById("collapseCierre").classList.add('show');
          this.valLiquiCerrada = true;
          this.calculaArancelCierre();
        }
      }

      this.totalesViews.tgt = parseFloat(this.importPed.total_gasto);
      this.totalesViews.total_transp = parseFloat(this.importPed.total_transp);
      this.totalesViews.ts = parseFloat(this.importPed.total_seguro);
      this.totalesViews.tf = parseFloat(this.importPed.total_fob);
      this.totalesViews.tgn = parseFloat(this.totalesViews.tgt) + parseFloat(this.totalesViews.total_transp) + parseFloat(this.totalesViews.ts) + parseFloat(this.totalesViews.tf) + parseFloat(this.totalesXProductosCierre.total_arancel);
      this.totalesXProductosTransp.total_valor = parseFloat('0.00');
      this.totalesXProductosTransp.total_peso = parseFloat('0.00');
      this.totalesXProductosTransp.total_volumen = parseFloat('0.00');

      if (this.factor_transp == "Valor") {
        this.prefijo = " ($)"
        this.calculteXValor();
      } else if (this.factor_transp == "Volumen") {
        this.prefijo = " (m^3)"
        this.calculteXVolumen();
      } else {
        this.prefijo = " (Kg)"
        this.calculteXPeso();
      }
    }
  }

  deleteLiquidacion(dt) {
    Swal.fire({
      text: 'INGRESE UN MOTIVO DE ANULACIÓN',
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
        if (informacion == "") {
          this.toastr.info("Ingrese una descripción");
        } else {
          this.lcargando.ctlSpinner(true);
          let data = {
            motivo: informacion,
            id_lqd: dt.id,
            ip: this.commonServices.getIpAddress(),
            accion: informacion,
            id_controlador: myVarGlobals.fConsultaLiquidaciones,
            pedidos: (dt.estado == "Liquidado") ? dt.detalle_cierre : dt.detalle,
            gastos: dt.gastos,
            user: this.dataUser.id_usuario,
            fecha: moment(this.hoy).format("YYYY-MM-DD"),
            estado: dt.estado
          }

          this.ConSrv.deleteLiquidacion(data).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.toastr.success(res['message']);
            this.rerender();
          }, error => {
            this.toastr.info(error.error.message);
          })
        }
      },
    })
  }
}
