import { Component, OnInit, ViewChild } from '@angular/core';
import { RecepcionService } from './recepcion.service';
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
import { ShowRecepcionComponent } from './show-recepcion/show-recepcion.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component'

@Component({
standalone: false,
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss']
})
export class RecepcionComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
  dataProducto: any = [{
    num_parte: null, fk_producto: 0, nombre: "Nombre producto", codigo_pro: "Código", cantidad: parseFloat("0.00"), fob: parseFloat("0.00"), total_fob: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
    pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00"), cantidad_recibida: parseFloat("0.00")
  }];

  importPed: any = {
    fk_provider: 0, fk_pais: 0, icoterm: 0, tipo_pago: 0, forma_pago: 0, total: parseFloat("0.00").toFixed(4), num_doc: "?", valor_base_cierre: parseFloat("0.00").toFixed(4),
    fecha_ped: new Date(), fecha_lleg: new Date(), paga_seguro: 1, estado: "Pendiente", tip_doc_compra: "INVOICE", gasto_origen: false, base_cierre: "Base cierre", calculo_recibido: 0,
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
  calculo: any = 0;
  flag: any = false;
  flagCountry: any = "assets/img/flags/flag-little/flag-black.png";
  vmButtons: any;

  constructor(
    private impSrv: RecepcionService,
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

    this.commonVarSrv.listenRecetionPedidosImp.asObservable().subscribe(res => {
      this.flag = true;
      this.importPed = res;
      this.importPed['total_seguro'] = parseFloat(this.importPed['total_seguro']).toFixed(4);
      this.importPed['total_pedido'] = parseFloat(this.importPed['total_pedido']).toFixed(4);
      this.importPed['total_transp'] = parseFloat(this.importPed['total_transp']).toFixed(4);
      this.importPed['total'] = parseFloat(this.importPed['total']).toFixed(4);
      this.importPed['total_gasto'] = parseFloat(this.importPed['total_gasto']).toFixed(4);
      this.dataProducto = res['detalle'];
      this.dataDifered = res['type_difered'];
      this.actions.btnSave = true;
      this.actions.btnmod = true;
      this.vmButtons[0]['habilitar'] = false;
      this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
      this.dataProducto.forEach(element => {
        element['precio'] = parseFloat(element['precio']).toFixed(4);
        element['total'] = parseFloat(element['total']).toFixed(4);
        element['cantidad'] = parseFloat(element['cantidad']).toFixed(2);
        element['cantidad_recibida'] = (this.importPed.recibido == 0) ? parseFloat(element['cantidad']).toFixed(2) : parseFloat(element['cantidad_recibida']).toFixed(2);
        element['fob_ant'] = parseFloat(element['fob']).toFixed(3);
      });
      this.changeFlag();
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsPedImpReceived", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR RECEPCIÓN" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsPedImpReceived", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PEDIDOS PENDIENTE DE RECIBIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsPedImpReceived", paramAccion: "", boton: { icon: "fas fa-arrow-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
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
      codigo: myVarGlobals.fRecepcionPedidos,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formularion recepción de pedidos de importación");
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
      this.arrayCountrys = res['data']
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
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  calculated(i?: any) {
    this.dataProducto.forEach(element => {
      element['cantidad_recibida'] = (element['cantidad_recibida'] == 0) ? element['cantidad'] : element['cantidad_recibida'];
      element['fob'] = (this.importPed.calculo_recibido == 0) ? parseFloat(element['total_fob']) / parseFloat(element['cantidad']) : parseFloat(element['total_fob']) / parseFloat(element['cantidad_recibida']);
      element['fob'] = parseFloat(element['fob'].toFixed(3));
    });
  }

  changeClaculated() {
    this.calculated();
  }


  cancel() {
    this.vmButtons[0]['habilitar'] = true;
    this.flag = false;
    this.calculo = 0;
    this.actions = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };
    this.dataProducto = [{
      num_parte: null, fk_producto: 0, nombre: "Nombre producto", codigo_pro: "Código", cantidad: parseFloat("0.00"), fob: parseFloat("0.00"), total_fob: parseFloat("0.00"), peso: parseFloat("0.00"), volumen: parseFloat("0.00"),
      pesoKg: parseFloat("0.00"), volumenm3: parseFloat("0.00"), total_Pcj_kg: parseFloat("0.00"), total_Pcj_vol: parseFloat("0.00"), total_Pcj_value: parseFloat("0.00"), cantidad_recibida: parseFloat("0.00")
    }];
    this.importPed = {
      fk_provider: 0, fk_pais: 0, icoterm: 0, tipo_pago: 0, forma_pago: 0, total: parseFloat("0.00").toFixed(4), num_doc: "?", base_cierre: "Base cierre", calculo_recibido: 0,
      fecha_ped: new Date(), fecha_lleg: new Date(), paga_seguro: 1, estado: "Pendiente", tip_doc_compra: "INVOICE", gasto_origen: false, valor_base_cierre: parseFloat("0.00").toFixed(4),
      anulado: 0, pagado: 0, total_pedido: parseFloat("0.00").toFixed(4), total_seguro: parseFloat("0.00").toFixed(4), total_transp: parseFloat("0.00").toFixed(4), total_gasto: parseFloat("0.00").toFixed(4)
    };
    this.detAux = [];
    this.flagBtnDired = false;
    this.dataDifered = null;

  }

  showPedidos() {
    const modalInvoice = this.modalService.open(ShowRecepcionComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRecepcionPedidos;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  async validateRecepcionImp() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar la recepción de los pedidos");
    } else {
      this.confirmSave("Seguro desea recibir el pedido?", "SAVE_RECEPCION_PEDIDO");
    }
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
        if (action == "SAVE_RECEPCION_PEDIDO") {
          this.updated();
        }
      }
    })
  }

  updated() {
    this.lcargando.ctlSpinner(true);

    this.importPed['fecha_recibido'] = moment(this.importPed.fecha_lleg).format('YYYY-MM-DD');
    this.importPed['user_recibido'] = this.dataUser.id_usuario;
    this.importPed['detalle'] = this.dataProducto;
    this.importPed['ip'] = this.commonServices.getIpAddress();
    this.importPed['accion'] = `Recepción de pedido de importación por el usuario ${this.dataUser.nombre} con id de usuario ${this.dataUser.id_usuario}`;
    this.importPed['id_controlador'] = myVarGlobals.fRecepcionPedidos;
    this.importPed['recibido'] = 1;
    this.importPed['estado'] = "Recibido";
    this.impSrv.saveRecepcionPedido(this.importPed).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeFlag() {
    if (this.importPed.fk_pais != 0) {
      this.flagCountry = this.arrayCountrys.filter(e => e.id == this.importPed.fk_pais)[0]['flag'];
    } else {
      this.flagCountry = "assets/img/flags/flag-little/flag-black.png";
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR RECEPCIÓN":
        this.validateRecepcionImp();
        break;
      case "PEDIDOS PENDIENTE DE RECIBIR":
        this.showPedidos();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
