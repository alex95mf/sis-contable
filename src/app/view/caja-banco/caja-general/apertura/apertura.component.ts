import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import * as moment from 'moment';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AperturaService } from './apertura.service';
import { ShowDenominationComponent } from './show-denomination/show-denomination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.scss']
})
export class AperturaComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  processing: any = false;
  dataUser: any;
  permisions: any;
  caja: any = { punto_emision: 0, valor_apertura: /* "" */0 };
  arrayCajas: any = [];
  arrayModals: any = null;
  vmButtons: any;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private aptSrv: AperturaService,
    private modalService: NgbModal
  ) {

    this.commonVarSrv.setValueCaja.asObservable().subscribe(res => {
      this.arrayModals = res;
      this.caja.valor_apertura = this.arrayModals['total'];
    })
  }

  ngOnInit(): void {

    /* setTimeout(() => {
			document.getElementById('idvalueapertura').focus();
		}, 1000); */
    this.vmButtons = [
      { orig: "btnOpenCaja", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      //{ orig: "btnOpenCaja", paramAccion: "", boton: { icon: "fas fa-money-bill-alt", texto: "DETALLE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnOpenCaja", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "ABRIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.getPermisions();
    }, 50);
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fAperturaCaja,
      id_rol: id_rol
    }
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Apertura de cajas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getDataUser();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDataUser() {
    this.caja.fecha_apertura = moment(this.viewDate).format('YYYY-MM-DD');
    this.caja.hora_apertura = moment(this.viewDate).format('HH:mm:ss');
    this.caja.name_user_caja = this.dataUser.nombre;
    this.caja.name_empresa = this.dataUser.company.nombre_comercial;
    this.caja.name_sucursal = this.dataUser.sucursal.nombre;
    this.caja.fk_usuario_caja = this.dataUser.id_usuario;
    this.caja.fk_sucursal = this.dataUser.id_sucursal;
    this.caja.fk_empresa = this.dataUser.id_empresa;
    this.getCajas();
  }

  getCajas() {
    this.aptSrv.getCajas().subscribe(res => {
      this.arrayCajas = res['data'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeCaja(evt) {
    if (evt != 0) {
      this.caja.nombre_caja = this.arrayCajas.filter(e => e.num_punto_emision == evt)[0]['pto_nombre'];
      this.caja.account_box = this.arrayCajas.filter(e => e.num_punto_emision == evt)[0]['account_box'];
    }
  }

  showDenominations() {
    const modalInvoice = this.modalService.open(ShowDenominationComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.info = this.arrayModals;
  }

  cancel() {
    this.arrayModals = null;
    this.caja = { punto_emision: 0, valor_apertura: /* "" */0 };
    this.caja.fecha_apertura = moment(this.viewDate).format('YYYY-MM-DD');
    this.caja.hora_apertura = moment(this.viewDate).format('HH:mm:ss');
    this.caja.name_user_caja = this.dataUser.nombre;
    this.caja.name_empresa = this.dataUser.company.nombre_comercial;
    this.caja.name_sucursal = this.dataUser.sucursal.nombre;
    this.caja.fk_usuario_caja = this.dataUser.id_usuario;
    this.caja.fk_sucursal = this.dataUser.id_sucursal;
    this.caja.fk_empresa = this.dataUser.id_empresa;
  }

  openCaja() {
    if (this.permisions.abrir == "0") {
      this.toastr.info("Usuario no permiso para abrir");
    } else {
      if (this.caja.punto_emision == 0) {
        this.toastr.info("Debe seleccionar una caja");
      } /* else if (this.caja.valor_apertura == "" || this.caja.valor_apertura == null || this.caja.valor_apertura == undefined) {
        console.log(this.caja.valor_apertura);
        this.toastr.info("Ingrese un valor de apertura");
        document.getElementById('idvalueapertura').focus();
      } */ else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea abrir la caja?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.viewDate = new Date();
            this.processing = false;
            this.caja['fecha_apertura'] = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
            this.caja['isOpen'] = 1;
            let data = {
              info: this.caja,
              ip: this.commonServices.getIpAddress(),
              accion: `Apertura de caja por el usuario ${this.dataUser.nombre}`,
              id_controlador: myVarGlobals.fAperturaCaja
            }
            this.lcargando.ctlSpinner(true);
            this.aptSrv.openBox(data).subscribe(res => {
              this.cancel();
              this.toastr.success(res['message']);
              this.caja = { punto_emision: 0, valor_apertura: /* "" */0 };
              this.arrayModals = null;
              this.arrayCajas = [];
              this.getDataUser();
            }, error => {
              this.caja = { punto_emision: 0, valor_apertura: /* "" */0 };
              this.cancel();
              this.processing = true;
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "ABRIR":
        this.openCaja();
        break;
      case "DETALLE":
        this.showDenominations();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
