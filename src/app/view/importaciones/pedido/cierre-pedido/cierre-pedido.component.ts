import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CierrePedidoService } from './cierre-pedido.service'
import { ShowPedidoCerradoComponent } from './show-pedido-cerrado/show-pedido-cerrado.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-cierre-pedido',
  templateUrl: './cierre-pedido.component.html',
  styleUrls: ['./cierre-pedido.component.scss']
})
export class CierrePedidoComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  importPed: any = {
    Total_peso: parseFloat('0.00').toFixed(2), total_volumen: parseFloat('0.00').toFixed(2), num_doc: "?",
    total_pedido: parseFloat('0.00').toFixed(2), total_gasto: parseFloat('0.00').toFixed(2), total: parseFloat('0.00').toFixed(2),
    providers: { razon_social: "razón social" }, country: { nom_pais: "País de origen",flag: "assets/img/flags/flag-little/flag-black.png"}
  };
  dataProducto: any = [{
    nombre: "nombre producto", codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
    poctj_base: parseFloat("0.00"), valor_base: parseFloat("0.00"), aplica: 0, fob: parseFloat("0.00"), total_fob: parseFloat("0.00"),
    gastos: parseFloat("0.00"), costo_s_gasto: parseFloat("0.00"), costo_c_gasto: parseFloat("0.00"), total_aux: parseFloat("0.00")
  }];

  dataUser: any;
  permisions: any;
  arrayPedidos: any;
  id_select: any = 0;
  fecha_cierre: any = new Date();
  total_gasto: any = parseFloat('0.00');
  total_general_global: any = parseFloat('0.00');
  nombre_base: any = "0";
  total_base: any = parseFloat('0.00');
  disabGlobal: any = false;
  vmButtons: any;
  flag:any = "assets/img/flags/flag-little/flag-black.png";

  /*Totales*/
  totales_views: any = {
    total_base: parseFloat('0.00').toFixed(4),
    total_peso: parseFloat('0.00').toFixed(4),
    total_volumen: parseFloat('0.00').toFixed(4),
    total_pedido: parseFloat('0.00').toFixed(4),
    total_gasto: parseFloat('0.00').toFixed(4),
    total_general: parseFloat('0.00').toFixed(4)
  }
  prefijo: any = "";

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private crrSrv: CierrePedidoService
  ) {

    this.commonVarSrv.cancelImpPedido.asObservable().subscribe(res => {
      this.cancel();
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrv.listenCierrePedidosImp.asObservable().subscribe(res => {
      this.disabGlobal = true;
      this.vmButtons[0].habilitar = true;
      this.importPed = res;
      this.dataProducto = res['detalle'];
      this.importPed['total_peso'] = parseFloat('0.00');
      this.importPed['total_volumen'] = parseFloat('0.00');

      this.totales_views = {
        total_base: parseFloat('0.00').toFixed(4),
        total_peso: parseFloat('0.00').toFixed(4),
        total_volumen: parseFloat('0.00').toFixed(4),
        total_pedido: parseFloat('0.00').toFixed(4),
        total_gasto: parseFloat('0.00').toFixed(4),
        total_general: parseFloat('0.00').toFixed(4)
      }

      this.importPed.gastos.forEach(element => {
        this.total_gasto = parseFloat(this.total_gasto) + parseFloat(element['total']);
      });
      this.importPed.detalle.forEach(element => {
        this.importPed['total_peso'] = parseFloat(this.importPed['total_peso']) + parseFloat(element['peso']);
        this.importPed['total_volumen'] = parseFloat(this.importPed['total_volumen']) + parseFloat(element['volumen'])
      });
      this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.total_gasto);
      this.importPed.total_gasto = parseFloat(this.total_gasto);
      this.total_general_global = this.importPed.total;
      this.totales_views['total_pedido'] = this.commonServices.formatNumber(this.importPed.total_pedido);
      this.totales_views['total_gasto'] = this.commonServices.formatNumber(this.total_gasto);
      this.totales_views['total_peso'] = this.commonServices.formatNumber(this.importPed.total_peso);
      this.totales_views['total_volumen'] = this.commonServices.formatNumber(this.importPed.total_volumen);
      this.totales_views['total_general'] = this.commonServices.formatNumber(this.importPed.total);
      this.nombre_base = this.importPed.base_cierre;
      this.calculated(this.nombre_base);
    })

  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsPedImpCierre", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CERRAR PEDIDO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsPedImpCierre", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PEDIDOS CERRADOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsPedImpCierre", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
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
      codigo: myVarGlobals.fCierrePedidos,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de cierre de pedidos");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getPedidos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getPedidos() {
    this.crrSrv.getPedidosGastos().subscribe(res => {
      this.arrayPedidos = res['data'];
      this.vmButtons[1].habilitar = false;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getPedidoFilter(evt) {
    this.cancel();
    this.total_gasto = parseFloat("0.00");
    this.importPed.total_gasto = parseFloat("0.00");
    this.id_select = evt;
    if (evt != 0) {
      this.importPed = this.arrayPedidos.filter(e => e.id == evt)[0];
      this.importPed['total_peso'] = parseFloat('0.00');
      this.importPed['total_volumen'] = parseFloat('0.00');

      this.totales_views = {
        total_base: parseFloat('0.00').toFixed(4),
        total_peso: parseFloat('0.00').toFixed(4),
        total_volumen: parseFloat('0.00').toFixed(4),
        total_pedido: parseFloat('0.00').toFixed(4),
        total_gasto: parseFloat('0.00').toFixed(4),
        total_general: parseFloat('0.00').toFixed(4)
      }

      this.importPed.gastos.forEach(element => {
        this.total_gasto = parseFloat(this.total_gasto) + parseFloat(element['total']);
      });
      this.importPed.detalle.forEach(element => {
        this.importPed['total_peso'] = parseFloat(this.importPed['total_peso']) + parseFloat(element['peso']);
        this.importPed['total_volumen'] = parseFloat(this.importPed['total_volumen']) + parseFloat(element['volumen'])
      });
      localStorage.setItem('detPedido', JSON.stringify(this.importPed.detalle));
      this.importPed.total = parseFloat(this.importPed.total_pedido) + parseFloat(this.total_gasto);
      this.importPed.total_gasto = parseFloat(this.total_gasto);
      this.total_general_global = this.importPed.total;
      this.totales_views['total_pedido'] = this.commonServices.formatNumber(this.importPed.total_pedido);
      this.totales_views['total_gasto'] = this.commonServices.formatNumber(this.total_gasto);
      this.totales_views['total_peso'] = this.commonServices.formatNumber(this.importPed.total_peso);
      this.totales_views['total_volumen'] = this.commonServices.formatNumber(this.importPed.total_volumen);
      this.totales_views['total_general'] = this.commonServices.formatNumber(this.importPed.total);
    }
  }

  cancel() {
    this.totales_views = {
      total_base: parseFloat('0.00').toFixed(4),
      total_peso: parseFloat('0.00').toFixed(4),
      total_volumen: parseFloat('0.00').toFixed(4),
      total_pedido: parseFloat('0.00').toFixed(4),
      total_gasto: parseFloat('0.00').toFixed(4),
      total_general: parseFloat('0.00').toFixed(4)
    }

    this.dataProducto = [{
      nombre: "nombre producto", codigo_pro: "Código", cantidad: parseFloat("0.00"), precio: parseFloat("0.00"), total: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
      poctj_base: parseFloat("0.00"), valor_base: parseFloat("0.00"), aplica: 0, fob: parseFloat("0.00"), total_fob: parseFloat("0.00"),
      gastos: parseFloat("0.00"), costo_s_gasto: parseFloat("0.00"), costo_c_gasto: parseFloat("0.00"), total_aux: parseFloat("0.00")
    }];
    this.importPed = {
      Total_peso: parseFloat('0.00').toFixed(4), total_volumen: parseFloat('0.00').toFixed(4), num_doc: "?",
      total_pedido: parseFloat('0.00').toFixed(4), total_gasto: parseFloat('0.00').toFixed(4), total: parseFloat('0.00').toFixed(4),
      providers: { razon_social: "razón social" }, country: { nom_pais: "País de origen",flag: "assets/img/flags/flag-little/flag-black.png" }
    };
    this.nombre_base = "0";
    this.total_base = parseFloat('0.00');
    this.fecha_cierre = new Date();
    this.total_gasto = parseFloat('0.00');
    this.total_general_global = parseFloat('0.00');
    this.disabGlobal = false;
    this.vmButtons[0].habilitar = false;
    this.id_select = 0;
    this.prefijo = "";
    this.getPedidos();
  }

  calculated(evt) {
    if (evt != "0") {
      this.dataProducto = (this.disabGlobal/* this.vmButtons[0].habilitar */) ? this.importPed.detalle : JSON.parse(localStorage.getItem('detPedido'));
      if (this.nombre_base == "Valor") {
        this.total_base = parseFloat(this.importPed['total_pedido']);
        this.prefijo = " ($)"
        this.calculteXValor();
      } else if (this.nombre_base == "Volumen") {
        this.total_base = parseFloat(this.importPed['total_volumen']);
        this.prefijo = " (m^3)"
        this.calculteXVolumen();
      } else {
        this.total_base = parseFloat(this.importPed['total_peso']);
        this.prefijo = " (Kg)"
        this.calculteXPeso();
      }
      this.totales_views.total_base = this.total_base;
    } else {
      this.cancel();
    }
  }

  calculteXValor() {
    this.dataProducto.forEach(element => {
      element['poctj_base'] = parseFloat(element['total_Pcj_value']);
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
      element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
      element['costo_s_gasto'] = parseFloat(element['total']);
      element['costo_c_gasto'] = parseFloat(element['total_fob']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
      element['total_aux'] = element['total'];
      element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
    });
  }

  calculteXVolumen() {
    this.dataProducto.forEach(element => {
      element['poctj_base'] = parseFloat(element['total_Pcj_vol']);
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
      element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
      element['costo_s_gasto'] = parseFloat(element['total']);
      element['costo_c_gasto'] = parseFloat(element['total_fob']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
      element['total_aux'] = element['total'];
      element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
    });
  }

  calculteXPeso() {
    this.dataProducto.forEach(element => {
      element['poctj_base'] = parseFloat(element['total_Pcj_kg']);
      element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
      element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
      element['costo_s_gasto'] = parseFloat(element['total']);
      element['costo_c_gasto'] = parseFloat(element['total_fob']);
      element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
      element['total_aux'] = element['total'];
      element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
    });
  }

  claculateNewPtjIndividual(index) {
    this.total_base = parseFloat('0.00');
    this.dataProducto[index]['aplica_base'] = !this.dataProducto[index]['aplica_base'];
    if (this.nombre_base == "Valor") {
      var potjValor = parseFloat('0.00');
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          potjValor += parseFloat(element.total);
          this.total_base = parseFloat(this.total_base) + parseFloat(element['total']);
        }
      });
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          element.poctj_base = this.getReglaDeTresPorcentaje(potjValor, element.total);
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total']);
        } else {
          element.poctj_base = parseFloat('0.00');
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
        }
      })
    } else if (this.nombre_base == "Volumen") {
      var potjVol = parseFloat('0.00');
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          potjVol += parseFloat(element.volumen);
          this.total_base = parseFloat(this.total_base) + parseFloat(element['volumen']);
        }
      });
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          element.poctj_base = this.getReglaDeTresPorcentaje(potjVol, element.volumen);
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
        } else {
          element.poctj_base = parseFloat('0.00');
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
        }
      })
    } else {
      var potjPeso = parseFloat('0.00');
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          potjPeso += parseFloat(element.peso);
          this.total_base = parseFloat(this.total_base) + parseFloat(element['peso']);
        }
      });
      this.dataProducto.forEach(element => {
        if (element['aplica_base']) {
          element.poctj_base = this.getReglaDeTresPorcentaje(potjPeso, element.peso);
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
        } else {
          element.poctj_base = parseFloat('0.00');
          element['total_fob'] = parseFloat(this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto)) + parseFloat(element['total']);
          element['gastos'] = this.getReglaDeTresValor(element['poctj_base'], this.importPed.total_gasto);
          element['costo_s_gasto'] = parseFloat(element['total']);
          element['costo_c_gasto'] = parseFloat(element['total_fob']);
          element['fob'] = parseFloat(element['total_fob']) / parseFloat(element['cantidad']);
          element['total_aux'] = element['total'];
          element['total_aux'] = this.commonServices.formatNumber(element['total_aux']);
        }
      })
    }
    this.totales_views.total_base = this.total_base;
  }

  getReglaDeTresPorcentaje(val1, val2) {
    let result = 0;
    result = 100 * val2;
    result = result / val1;
    return parseFloat(result.toString()).toFixed(4);
  }

  getReglaDeTresValor(val1, val2) {
    let result = 0;
    result = val1 * val2;
    result = result / 100;
    return parseFloat(result.toString()).toFixed(4);
  }

  async validateSaveCierreImp() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea cerrar el pedido?", "SAVE_CIERRE_PEDIDO");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.id_select == '0') {
        this.toastr.info("Seleccione un pedido");
      } else if (this.nombre_base == '0') {
        this.toastr.info("Ingrese un tipo de documento");
        document.getElementById("idtiprefdoc").focus(); return;
      } else {
        resolve(true)
      }
    });
  }

  async confirmSave(message, action, infodev?: any) {
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
        if (action == "SAVE_CIERRE_PEDIDO") {
          this.saveCierrePedido();
        }
      }
    })
  }

  saveCierrePedido() {
    this.lcargando.ctlSpinner(true);
    this.importPed['total_fob_pedido'] = parseFloat('0.00');
    this.dataProducto.forEach(element => {
      this.importPed['total_fob_pedido'] += parseFloat(element['total_fob']);
    });
    this.importPed['fecha_cierre'] = moment(this.fecha_cierre).format('YYYY-MM-DD');
    this.importPed['user_cierre'] = this.dataUser.id_usuario;
    this.importPed['detalle'] = this.dataProducto;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Cierre de pedido de importación por el usuario ${this.dataUser.nombre} con id ${this.dataUser.id_usuario}`;
    this.importPed['id_controlador'] = myVarGlobals.fCierrePedidos;
    this.importPed['valor_base_cierre'] = parseFloat(this.totales_views.total_base);
    this.importPed['base_cierre'] = this.nombre_base;
    this.importPed['total'] = parseFloat(this.total_general_global);
    this.importPed['estado'] = "Aprobado";
    this.crrSrv.saveCierrePedido(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      localStorage.removeItem('detPedido');
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  showPedidosCerrados() {
    const modalInvoice = this.modalService.open(ShowPedidoCerradoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fCierrePedidos;
    modalInvoice.componentInstance.editar = this.permisions.eliminar;
    this.cancel();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR PEDIDO":
        this.validateSaveCierreImp();
        break;
      case "PEDIDOS CERRADOS":
        this.showPedidosCerrados();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
