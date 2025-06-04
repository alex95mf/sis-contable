import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { CreacionService } from './creacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowBoxComponent } from './show-box/show-box.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ShowCuentasCajaComponent } from './show-cuentas-caja/show-cuentas-caja.component'

@Component({
standalone: false,
  selector: 'app-creacion',
  templateUrl: './creacion.component.html',
  styleUrls: ['./creacion.component.scss']
})
export class CreacionComponent implements OnInit {
  processing: any;
  dataUser: any;
  permisions: any;
  caja: any = { fk_usuario: 0, estado: 1, fk_banco: 0, nombre_caja: "", monto: "", mov_minimo: "", observacion: "", cuenta_caja: "" };
  arrayUsers: any;
  btnSave: any = false;
  btnMod: any = false;
  arrayBanks: any;
  isTxNumber: boolean = false;
  montoAux: any = parseFloat('0.00');
  fk_bank_aux: any = 0;

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private crtSrv: CreacionService,
    private modalService: NgbModal,
    private commVarServ: CommonVarService
  ) {
    this.commVarServ.listenAccountBoxSmall.asObservable().subscribe(res => {
      this.caja.cuenta = res.codigo;
      this.caja.name_cuenta = res.nombre_caja;
    })

    this.commVarServ.smallListenAccountBox.asObservable().subscribe(res => {
      this.caja.cuenta_caja = res.codigo;
      this.caja.name_cuenta_caja = res.nombre;
    })

    this.commVarServ.listenBoxSmall.asObservable().subscribe(res => {
      this.caja = res;
      this.btnSave = true;
      this.btnMod = true;
      this.caja.monto = parseFloat(this.caja.monto).toFixed(4);
      this.caja.mov_minimo = parseFloat(this.caja.mov_minimo).toFixed(4);
      this.caja.saldo = parseFloat(this.caja.saldo).toFixed(4);
      this.montoAux = res.monto;
      this.fk_bank_aux = res.fk_banco;
      this.caja.beneficiario = res.comprobante[0]['beneficiario'];

      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
    })

  }

  vmButtons: any = [];
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnCraCChi", paramAccion: "", boton: { icon: "fa fa-search", texto: "CAJAS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false },
      { orig: "btnCraCChi", paramAccion: "", boton: { icon: "fa fa-check", texto: "CREAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnCraCChi", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnCraCChi", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CAJAS":
        this.getBoxSmall();
        break;
      case "CREAR":
        this.validateSave();
        break;
      case "MODFICAR":
        this.updateBoxSmall();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCreaCajaChica,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de apertura de creación de caja chica");
      } else {
        this.getUsuarios();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUsuarios() {
    this.crtSrv.getUsuario().subscribe(res => {
      this.arrayUsers = res['data'];
      this.getInfoBank();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBoxSmall() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene Permiso para consultar");
    } else {
      const modalInvoice = this.modalService.open(ShowBoxComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    }
  }

  cancel() {
    this.caja = { fk_usuario: 0, estado: 1, fk_banco: 0, nombre_caja: "", monto: "", mov_minimo: "", observacion: "", cuenta_caja: "" };
    this.btnSave = false;
    this.btnMod = false;
    this.isTxNumber = false;

    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
  }

  validateSave() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.caja.fk_usuario == 0) {
        this.toastr.info('Seleccione un usuario');
        document.getElementById('idUser').focus();
      } else if (this.caja.cuenta_caja == "") {
        this.toastr.info('Seleccione una cuenta contable');
        document.getElementById('idcuentacontable').focus();
      } else if (this.caja.nombre_caja == "") {
        this.toastr.info('Ingrese un nombre de caja chica');
        document.getElementById('nameBox').focus();
      } else if (this.caja.monto == "") {
        this.toastr.info('Ingrese un monto mayor a 0');
        document.getElementById('montoBox').focus();
      } else if (this.caja.mov_minimo == "") {
        this.toastr.info('Ingrese un minimo de movimiento mayor 0 y menor al monto de apertura');
        document.getElementById('movBox').focus();
      } else if (this.caja.beneficiario === undefined || this.caja.beneficiario === null || this.caja.beneficiario === "") {
        this.toastr.info("Ingrese un beneficiario");
        document.getElementById('idBenf').focus();
      } else if (this.caja.fk_banco == 0) {
        this.toastr.info('Seleccione una cuenta bancaria');
        document.getElementById('idBank').focus();
      } else if (/* this.isTxNumber === true && ( */this.caja.num_doc_tx === undefined || this.caja.num_doc_tx === null || this.caja.num_doc_tx === ""/* ) */) {
        this.toastr.info("Ingrese el número respectivo del documento.");
        document.getElementById('idNumDoc').focus();
      } else if (parseFloat(this.caja.monto) <= parseFloat(this.caja.mov_minimo)) {
        this.toastr.info('El monto mínimo no puede ser mayor o igual al monto de apertura');
        document.getElementById('movBox').focus();
      } else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea guardar la caja?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.saveBoxSmall();
          }
        })
      }
    }
  }

  updateBoxSmall() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      if (this.caja.fk_usuario == 0) {
        this.toastr.info('Seleccione un usuario');
      } else if (this.caja.fk_banco == 0) {
        this.toastr.info('Seleccione una cuenta');
        document.getElementById('nameBox').focus();
      } else if (this.caja.nombre_caja == "") {
        this.toastr.info('Ingrese un nombre de caja chica');
        document.getElementById('nameBox').focus();
      } else if (this.caja.monto == "") {
        this.toastr.info('Ingrese un monto');
        document.getElementById('montoBox').focus();
      } else if (this.caja.mov_minimo == "") {
        this.toastr.info('Ingrese un minimo de movimiento');
        document.getElementById('movBox').focus();
      } else if (parseFloat(this.caja.monto) < parseFloat(this.caja.mov_minimo)) {
        this.toastr.info('El monto mínimo no puede ser mayor al monto');
        document.getElementById('movBox').focus();
      } /* else if (parseFloat(this.caja.monto) < parseFloat(this.caja.saldo)) { */
      else if (parseFloat(this.caja.saldo) < parseFloat(this.montoAux)) {
        this.toastr.info(`El saldo $${this.caja.saldo} es diferente al monto actual $${this.montoAux}  por lo que ya hubo movimiento en esta caja y no puede ser modificado su monto`);
        document.getElementById('montoBox').focus();
      } else if (this.caja.estado == '0' && parseFloat(this.caja.saldo) > parseFloat('0.00')) {
        Swal.fire({
          title: 'Error!!',
          text: `No se puede inactivar la caja,tiene un saldo de $${this.caja.saldo}`,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          document.getElementById('montoBox').focus();
        })
      } else {

        Swal.fire({
          title: "Atención!!",
          text: (this.caja.estado == '1') ? "Seguro desea actualizar el registro?" : "Seguro desea inactivar la caja?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.updated();
          }
        })
      }
    }
  }

  updated() {
    this.caja['montoAux'] = this.montoAux;
    this.caja['fk_bank_aux'] = this.fk_bank_aux;
    let data = {
      info: this.caja,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de caja chica por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fCreaCajaChica
    }
    this.mensajeSpinner = "Modificando caja...";
    this.lcargando.ctlSpinner(true);
    this.crtSrv.updatedBoxSmall(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  saveBoxSmall() {
    this.caja['saldo'] = this.caja.monto;
    if (this.caja.num_doc_tx === undefined || this.caja.num_doc_tx === null || this.caja.num_doc_tx === "") delete this.caja.num_doc_tx

    let data = {
      info: this.caja,
      ip: this.commonServices.getIpAddress(),
      accion: `Creación de nueva caja chica por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fCreaCajaChica
    }
    this.mensajeSpinner = "Creando caja...";
    this.lcargando.ctlSpinner(true);
    this.crtSrv.saveBoxSmall(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getInfoBank() {
    let payload = {
      type: ['Ahorros', 'Corriente', 'Boveda']
    }
    this.crtSrv.getAvailableBanks(payload).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayBanks = res['data'];
      this.processing = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getNameBank(evt) {
    if (evt != 0) {
      let account = this.arrayBanks.find(e => e.id_banks == evt);

      this.caja.name_cuenta = account['name_banks'];
      this.caja.cuenta = account['cuenta_contable'];

      this.isTxNumber = (account != undefined && account.tipo_cuenta === "Corriente") ? true : false;
      //this.caja.num_doc_tx = undefined;

      /* this.caja.name_cuenta = this.arrayBanks.filter(e => e.id_banks == evt)[0]['name_banks'];
      this.caja.cuenta = this.arrayBanks.filter(e => e.id_banks == evt)[0]['cuenta_contable']; */
    } else {
      this.isTxNumber = false;
      this.caja.num_doc_tx = undefined;
    }
  }

  showAccounts() {
    const modalInvoice = this.modalService.open(ShowCuentasCajaComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

}
