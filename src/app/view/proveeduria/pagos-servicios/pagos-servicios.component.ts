import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagosServiciosService } from './pagos-servicios.service'
import { CommonService } from '../../../services/commonServices';
import { CommonVarService } from '../../../services/common-var.services';
import { IngresoService } from '../../inventario/producto/ingreso/ingreso.service';
import { ShowPagosServiciosComponent } from './show-pagos-servicios/show-pagos-servicios.component'

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { ValidacionesFactory } from '../../../config/custom/utils/ValidacionesFactory';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-pagos-servicios',
  templateUrl: './pagos-servicios.component.html',
  styleUrls: ['./pagos-servicios.component.scss']
})
export class PagosServiciosComponent implements OnInit {

  /* validation actions */
  payload: any;
  permissions: any;
  processing: boolean = false;

  /* dictionaries */
  catalogs: Array<any> = [];
  centro_c: Array<any> = [];
  servicios: Array<any> = [
    { nombre: "", cant: 0, precio: 0.00, total: 0.00, totalParse: "0.00" },
    { nombre: "", cant: 0, precio: 0.00, total: 0.00, totalParse: "0.00" }
  ];
  d_serv: Array<any> = [];

  /* payload information */
  btn_actions: any = { show: false, add: false, update: true };
  values: any = { doc: 0, cc: 0, imp: false, pedido: false, liq: false, subtotal: 0.00, total: 0.00, iva: 0.00, ice: 0.00, obs: "" };

  /* timestamp */
  current_date: Date = new Date();

  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(private toastr: ToastrService, private router: Router, private pSrv: PagosServiciosService,
    private ingresoSrv: IngresoService, private commonServices: CommonService, private commonVarSrv: CommonVarService,
    private elementRef: ElementRef, private modalService: NgbModal
  ) {
    this.commonVarSrv.showPASListen.asObservable().subscribe(res => {
      this.btn_actions.add = true;
      this.btn_actions.update = false;

      this.vmButtons[0].habilitar = true;
      this.vmButtons[2].habilitar = false;

      if(res=="Eliminar"){
        this.cancelProcess();
      }else{
        this.current_date = res["fecha"];
        this.values = {
          id: res["id"], doc: res["doc"], cc: res["cc"], imp: res["imp"], pedido: res["pedido"], liq: res["liq"], subtotal: res["subtotal"], total: res["total"], iva: res["iva"], ice: res["ice"], obs: res["obs"]
        };
        if (res["num"] !== null) {
          this.values.num = res["num"]
        } else {
          delete this.values.num;
        }
        if (res["num_imp"] !== null) {
          this.values.num_imp = res["num_imp"]
        } else {
          delete this.values.num_imp;
        }
        this.servicios = res["details"];
      }
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnPagDServs", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnPagDServs", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "SERVICIOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnPagDServs", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true },
      { orig: "btnPagDServs", paramAccion: "", boton: { icon: "fa fa-ban", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10)

    this.elementRef.nativeElement.ownerDocument.body.style = 'background: url(/assets/img/fondo1.jpg);background-size: cover !important;no-repeat;';
    this.getPermissions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.generateService();
        break;
      case "SERVICIOS":
        this.showModalPaymentAndSrv();
        break;
      case "ACTUALIZAR":
        this.setService();
        break;
      case "CANCELAR":
        this.cancelProcess();
        break;
    }
  }

  /* Calls API REST */
  getPermissions() {
    this.payload = JSON.parse(localStorage.getItem('Datauser'));

    let params = { codigo: myVarGlobals.fPagoServicios, id_rol: this.payload.id_rol }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene acceso a este formulario.");
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
      } else {
        this.getGroupCatalogs();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getGroupCatalogs() {
    let data = { fields: ["PAGO SERVICIOS"] };

    this.ingresoSrv.getCommonInformationFormule(data).subscribe(res => {
      this.catalogs = res['data']['catalogs']
      this.getCentroCosto()
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCentroCosto() {
    this.pSrv.getCentroCosto().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.centro_c = res['data']
      this.processing = true
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  addPayService() {
    this.values.fecha = moment(this.current_date).format('YYYY-MM-DD');
    this.values.details = this.servicios;
    this.values.ip = this.commonServices.getIpAddress();
    this.values.accion = `Registro de pago de servicio`;
    this.values.id_controlador = myVarGlobals.fPagoServicios;

    (this as any).mensajeSpinner = "Añadiendo...";
    this.lcargando.ctlSpinner(true);
    this.pSrv.addPaymentAndServ(this.values).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res["message"])
      this.cancelProcess();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  setPayService() {
    this.values.fecha = moment(this.current_date).format('YYYY-MM-DD');
    this.values.details = this.servicios;
    this.values.pas_delete = this.d_serv;
    this.values.ip = this.commonServices.getIpAddress();
    this.values.accion = `Actualización de pago del servicio ${this.values.id}`;
    this.values.id_controlador = myVarGlobals.fPagoServicios;

    (this as any).mensajeSpinner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.pSrv.setPaymentAndServ(this.values).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res["message"])
      this.cancelProcess();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* common methods */
  cancelProcess() {
    this.current_date = new Date();
    this.btn_actions = { show: false, add: false, update: true };
    this.values = { doc: 0, cc: 0, imp: false, pedido: false, liq: false, subtotal: 0.00, total: 0.00, iva: 0.00, ice: 0.00, obs: "" };
    this.servicios = [
      { nombre: "", cant: 0, precio: 0.00, total: 0.00, totalParse: "0.00" },
      { nombre: "", cant: 0, precio: 0.00, total: 0.00, totalParse: "0.00" }
    ];
    this.d_serv = [];

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
  }

  addItemServices() {
    this.servicios.push({ nombre: "", cant: 0, precio: 0.00, total: 0.00, totalParse: "0.00" });
  }

  deleteService(idx) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (!this.btn_actions.update) this.d_serv.push(this.servicios[idx]);

      this.servicios.splice(idx, 1);
      this.setTotal();
    }
  }

  async generateService() {
    await this.commonValidate().then(resp => {
      if (resp) {
        this.confirmAction("Seguro desea realizar esta acción?", "ADD_SERVICE");
      }
    });
  }

  async setService() {
    await this.commonValidate().then(resp => {
      if (resp) {
        this.confirmAction("Seguro desea realizar esta acción?", "SET_SERVICE");
      }
    });
  }

  /* validations forms */
  commonValidate() {
    return new Promise((resolve, reject) => {
      if (this.values.doc == 0) {
        this.toastr.info("Seleccione un tipo de documento");
      } else if (this.values.doc != 'No Deducible' && (this.values.num === undefined || this.values.num === null || this.values.num === "")) {
        this.toastr.info("Ingrese el número de documento");
      } else if (this.values.imp === true && (this.values.pedido === false && this.values.liq === false)) {
        this.toastr.info("Seleccione un tipo de importación");
      } else if ((this.values.pedido === true || this.values.liq === true) && (this.values.num_imp === undefined || this.values.num_imp === null || this.values.num_imp === "")) {
        this.toastr.info("Ingrese el número de importación");
      } else if (this.current_date === undefined || this.current_date === null) {
        this.toastr.info("Ingrese el campo fecha");
      } else if (this.values.obs === undefined || this.values.obs === null || this.values.obs === "") {
        this.toastr.info("Ingrese una observación");
      } else {
        let contador = 0;
        this.servicios.find(el => {
          if (el.nombre === "" || el.cant === 0 || el.total <= 0.00) {
            if (contador === 0) {
              this.toastr.info("Revise que los campos de servicios esten completo")
              resolve(false)
            }
            contador++;
          }
        });
        resolve(true);
      }
    });
  }

  /* Events */
  setPrice(idx) {
    let subtotal = parseFloat(this.servicios[idx]["cant"]) * parseFloat(this.servicios[idx]["precio"]);

    this.servicios[idx]["total"] = Number.isNaN(subtotal) ? 0.00 : subtotal;
    this.servicios[idx]["totalParse"] = Number.isNaN(subtotal) ? 0.00 : this.commonServices.formatNumber(subtotal);

    this.setTotal();
  }

  setTotal() {
    let balance = this.servicios.reduce(
      (acc, el) => acc + el.total, 0
    );

    let iva = Number.isNaN(this.values.iva) ? 0.00 : this.values.iva;
    let ice = Number.isNaN(this.values.ice) ? 0.00 : this.values.ice;

    this.values.subtotal = balance;
    let total = parseFloat(balance) + parseFloat(iva) + parseFloat(ice);
    this.values.total = Number.isNaN(total) ? 0.00 : total;
  }

  /* onChange */
  setTypeDoc(evt) {
    if (evt === "No Deducible") delete this.values.num;
  }

  setImp(evt) {
    if (!this.values.imp) {
      this.values.liq = false;
      this.values.pedido = false;
      delete this.values.num_imp;
    }
  }

  setTypeImp(evt) {
    let radio = evt.target;
    switch (radio.id) {
      case "customRadioPedido":
        this.values.pedido = true;
        this.values.liq = false;
        break;
      case "customRadioLiq":
        this.values.liq = true;
        this.values.pedido = false;
        break;
      default:
        this.values.liq = false;
        this.values.pedido = false;
        break;
    }
  }

  /* Actions CRUD'S */
  async confirmAction(message, action) {
    Swal.fire({
      title: "Atención!",
      text: message,
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action === "ADD_SERVICE") {
          this.addPayService();
        } else if (action === "SET_SERVICE") {
          this.setPayService();
        }
      }
    })
  }

  /* Modals */
  showModalPaymentAndSrv() {
    const modalInvoice = this.modalService.open(ShowPagosServiciosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.permissions = this.permissions;
  }
}
