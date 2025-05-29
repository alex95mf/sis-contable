import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValeService } from './vale.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ReposicionComponent } from './reposicion/reposicion.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-vale',
  templateUrl: './vale.component.html',
  styleUrls: ['./vale.component.scss']
})
export class ValeComponent implements OnInit {
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  dataUser: any;
  permisions: any;
  smallBox: any = {
    fk_tipo_doc: 0, status: 1, total: parseFloat('0.00').toFixed(2), fk_tipo_mov: 0,
    fk_caja_chica: 0, fk_centro_costo: 0, sub_total: parseFloat('0.00').toFixed(2), iva_valor: parseFloat('0.00').toFixed(2),
    fecha_mov: moment(this.toDatePicker).format('YYYY-MM-DD'), monto: parseFloat('0.00').toFixed(2),
    saldo: parseFloat('0.00').toFixed(2), reposicion: parseFloat('0.00').toFixed(2), num_aut: null, num_doc: null, beneficiario: null,
    valor_mov: parseFloat('0.00').toFixed(2), value_total_mov: parseFloat('0.00')
  };
  arrayTpGasto: any;
  arrayTypeDoc: any;
  arrayBox: any;
  arrayCentroCosto: any;
  validaDt: any;
  dataDT: any;
  arrayMov: any;
  disbInfo: any = false;
  btnSave: any = false;
  btnUpdated: any = false;

  vmButtons: any;
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private vlSrv: ValeService,
    private modalService: NgbModal,
    private commVarServ: CommonVarService
  ) {
    this.commVarServ.listenBoxSmallReposition.asObservable().subscribe(res => {
      /* location.reload(); */
      this.cancel();
    })

    this.commVarServ.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnIngVale", paramAccion: "", boton: { icon: "far fa-arrow-alt-square-left", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnIngVale", paramAccion: "", boton: { icon: "far fa-arrow-alt-square-right", texto: "REPONER" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnIngVale", paramAccion: "", boton: { icon: "fas fa-edit", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true, imprimir: false },
      { orig: "btnIngVale", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveVale();
        break;
      case "REPONER":
        this.getreposition();
        break;
      case "ACTUALIZAR":
        this.validateUpdate();
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
      codigo: myVarGlobals.fEgresoCajaChica,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de egresos de caja chica");
        this.vmButtons = [];
      } else {
        this.getAccountSmallBox();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAccountSmallBox() {
    this.vlSrv.getAccountSmallBox().subscribe(res => {
      this.arrayTpGasto = res['data'];
      this.getTipoDoc();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTipoDoc() {
    this.vlSrv.getTipoDoc().subscribe(res => {
      this.arrayTypeDoc = res['data'];
      this.getBoxSmallXUsuario();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBoxSmallXUsuario() {
    this.vlSrv.getBoxSmallXUsuario().subscribe(res => {
      this.arrayBox = res['data'];
      this.getCentroCosto();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCentroCosto() {
    this.vlSrv.getCentroCosto().subscribe(res => {
      this.arrayCentroCosto = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.vlSrv.getImpuestos().subscribe(res => {
      this.smallBox.iva = res['data'][0];
      this.smallBox.iva = this.smallBox.iva.valor;
      this.smallBox.iva = (this.smallBox.iva / 100) * 100;
      this.getDataTableGlobals();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  getDataTableGlobals() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      order: [[2, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.validaDt = true;
    this.arrayMov = [];
    this.dataDT = [];
    setTimeout(() => {
      this.lcargando.ctlSpinner(false);
      this.dtTrigger.next();
    }, 50);
  }

  rerender(): void {
    this.validaDt = false;
    this.dataDT = [];
    this.arrayMov = [];
    if (this.smallBox.fk_caja_chica != 0) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getDataTableMovRerender();
      });
    }
  }

  getDataTableMovRerender() {
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
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.vlSrv.getMovements({ id_box: this.smallBox.fk_caja_chica }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.dataDT = res['data'];
      this.arrayMov = res['data'][0]['detalle'];
      Object.keys(this.arrayMov).forEach(key => {
        this.arrayMov[key].value_total_mov = parseFloat(this.arrayMov[key].value_total_mov).toFixed(2);
      })
      this.smallBox.monto = parseFloat(this.dataDT[0]['monto']).toFixed(2);
      this.smallBox.saldo = parseFloat(this.dataDT[0]['saldo']).toFixed(2);
      this.smallBox.reposicion = (parseFloat(this.dataDT[0]['monto']) - parseFloat(this.dataDT[0]['saldo'])).toFixed(2);
      if (this.dataDT[0]['saldo'] <= this.dataDT[0]['mov_minimo']) {
        Swal.fire({
          title: 'Error!!',
          text: "La caja ha llegado a su saldo mínimo, es necesario que realize una reposición!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      }
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.validaDt = true;
      this.arrayMov = [];
      this.dataDT = [];

      setTimeout(() => {
        this.dtTrigger.next();
        this.lcargando.ctlSpinner(false);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  calculateTotal() {
    this.smallBox.iva_valor = this.smallBox.sub_total * (this.smallBox.iva / 100);
    this.smallBox.iva_valor = parseFloat(this.smallBox.iva_valor).toFixed(2);
    this.smallBox.total = parseFloat(this.smallBox.sub_total) + parseFloat(this.smallBox.iva_valor);
    this.smallBox.total = this.smallBox.total.toFixed(2);
  }

  cancel() {
    this.lcargando.ctlSpinner(true);
    this.smallBox = {
      fk_tipo_doc: 0, status: 1, total: parseFloat('0.00').toFixed(2), fk_tipo_mov: 0,
      fk_caja_chica: 0, fk_centro_costo: 0, sub_total: parseFloat('0.00').toFixed(2), iva_valor: parseFloat('0.00').toFixed(2),
      fecha_mov: moment(this.toDatePicker).format('YYYY-MM-DD'), monto: parseFloat('0.00').toFixed(2),
      saldo: parseFloat('0.00').toFixed(2), reposicion: parseFloat('0.00').toFixed(2), num_aut: null, num_doc: null, beneficiario: null,
      valor_mov: parseFloat('0.00').toFixed(2), value_total_mov: parseFloat('0.00')
    };
    this.dataDT = [];
    this.arrayMov = [];
    this.btnSave = false;
    this.btnUpdated = false;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      /* this.getDataTableGlobals(); */
      this.getAccountSmallBox();
    });
  }

  setTotal() {
    if (this.smallBox.fk_tipo_doc == 21 || this.smallBox.fk_tipo_doc == 0) {
      this.disbInfo = true;
      this.smallBox.total = parseFloat('0.00').toFixed(2);
      this.smallBox.iva_valor = parseFloat('0.00').toFixed(2);
      this.smallBox.sub_total = parseFloat('0.00').toFixed(2);
    } else {
      this.smallBox.valor_mov = parseFloat('0.00').toFixed(2);
      this.disbInfo = false;
    }
  }

  setTotalTwo() {
    if (this.smallBox.fk_tipo_mov == 236 || this.smallBox.fk_tipo_mov == 0) {
      //this.disbInfo = true;
      this.smallBox.total = parseFloat('0.00').toFixed(2);
      this.smallBox.iva_valor = parseFloat('0.00').toFixed(2);
      this.smallBox.sub_total = parseFloat('0.00').toFixed(2);
    } else {
      this.smallBox.valor_mov = parseFloat('0.00').toFixed(2);
      //this.disbInfo = false;
    }
  }

  async validateSaveVale() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea realizar el egreso por vale?", "SAVE_CAJA_MOV");
        }
      })
    }
  }

  async validateUpdate() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar información");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar el registro del vale?", "UPDATED_CAJA_MOV");
        }
      })
    }
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if (this.smallBox.fk_caja_chica == 0) {
        this.toastr.info('Debe seleccionar una caja');
        document.getElementById('idSmallBox').focus();
      } else if (this.smallBox.fk_tipo_mov == 0) {
        this.toastr.info('Seleccione un tipo de gasto');
        document.getElementById('idTipMov').focus();
      } else if (this.smallBox.fk_tipo_doc == 0) {
        this.toastr.info('Seleccione un tipo de documento');
        document.getElementById('idTipDoc').focus();
      } else if ((this.smallBox.num_aut == null || this.smallBox.num_aut == "") && this.smallBox.fk_tipo_doc != 21) {
        this.toastr.info('Ingrese un número de autorización');
        document.getElementById('idNumAut').focus(); return;
      } else if (this.smallBox.beneficiario == null || this.smallBox.beneficiario == "") {
        this.toastr.info('Ingrese nombre del beneficiario');
        document.getElementById('idNameBen').focus(); return;
      } else if ((this.smallBox.num_doc == null || this.smallBox.num_doc == "") && this.smallBox.fk_tipo_doc != 21) {
        this.toastr.info('Ingrese un número de documento');
        document.getElementById('idmudoc').focus(); return;
      }  /* else if (this.smallBox.fk_centro_costo == 0) {
        this.toastr.info('Seleccione un centro de costo');
      } */else if ((this.smallBox.fk_tipo_doc == 21) &&
        (this.smallBox.valor_mov <= 0 || this.smallBox.valor_mov == "" || this.smallBox.valor_mov == undefined || this.smallBox.valor_mov == null)) {
        this.toastr.info('Valor del vale no puede ser 0');
        document.getElementById('idValMov').focus(); return;
      } else if ((this.smallBox.fk_tipo_doc != 21 && this.smallBox.fk_tipo_doc != 0) && this.smallBox.sub_total <= 0.00 &&
        (this.smallBox.fk_tipo_mov != 0 && this.smallBox.fk_tipo_mov != 236)) {
        this.toastr.info('Ingrese el subtotal del documento');
        document.getElementById('idSubtotal').focus(); return;
      } else if ((this.smallBox.fk_tipo_doc != 21 && this.smallBox.fk_tipo_doc != 0) &&
        (this.smallBox.fk_tipo_mov == 236)) {
        this.toastr.info('Si el tipo de documento es diferente de vale de caja debe seleccionar un tipo de gasto diferente a no deducible');
      } else if (this.smallBox.concepto == null || this.smallBox.concepto == "") {
        this.toastr.info('Ingrese el concepto por el cual se hizo el vale');
        document.getElementById('idconcepto').focus(); return;
      } else if ((this.smallBox.fk_tipo_doc != 21) && (parseFloat(this.smallBox.total) > parseFloat(this.smallBox.saldo))) {
        this.toastr.info('Saldo insuficiente!!');
        document.getElementById('idSubtotal').focus(); return;
      } else if ((this.smallBox.fk_tipo_doc == 21) && (parseFloat(this.smallBox.valor_mov) > parseFloat(this.smallBox.saldo))) {
        this.toastr.info('Saldo insuficiente!!');
        document.getElementById('idValMov').focus(); return;
      } else if ((this.smallBox.fk_tipo_doc != 21) && (this.smallBox.total == 0)) {
        this.toastr.info('Valor no puede ser 0');
        document.getElementById('idSubtotal').focus(); return;
      } else if (this.smallBox.fk_tipo_doc == 21 && this.smallBox.fk_tipo_mov == 236 &&
        (this.smallBox.valor_mov == 0.00 || this.smallBox.valor_mov == "")) {
        this.toastr.info('Ingrese el valor del movimiento');
        this.smallBox.total = parseFloat('0.00').toFixed(2);
        this.smallBox.iva_valor = parseFloat('0.00').toFixed(2);
        this.smallBox.sub_total = parseFloat('0.00').toFixed(2);
        document.getElementById('idValMov').focus(); return;
      } else {
        this.smallBox['cuenta_gasto'] = this.arrayTpGasto.filter(e => e.fk_cuenta_contable == this.smallBox.fk_tipo_mov)[0]['cuenta_contable'];
        resolve(true);
      }
    });
  }

  async confirmSave(message, action, info?) {
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
        if (action == "SAVE_CAJA_MOV") {
          this.saveVale();
        } else if (action == "UPDATED_CAJA_MOV") {
          this.updateVale();
        } else if (action == "DELETE_CAJA_MOV") {
          this.deleteVale(info);
        }
      }
    })
  }

  saveVale() {
    this.lcargando.ctlSpinner(true);
    this.smallBox.value_total_mov = (this.smallBox.valor_mov > 0.00) ? this.smallBox.valor_mov : this.smallBox.total;
    let data = {
      info: this.smallBox,
      ip: this.commonServices.getIpAddress(),
      accion: `Egreso de caja chica por un valor de $${this.smallBox.value_total_mov} por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fEgresoCajaChica
    }

    this.vlSrv.saveValeCaja(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  updateVale() {
    this.lcargando.ctlSpinner(true);
    this.smallBox.value_total_mov = (this.smallBox.valor_mov > 0.00) ? this.smallBox.valor_mov : this.smallBox.total;
    let data = {
      info: this.smallBox,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualizacion de vale caja chica por el usuario ${this.dataUser.id_usuario}`,
      id_controlador: myVarGlobals.fEgresoCajaChica
    }
    this.vlSrv.updateValeCaja(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  updatedInfo(dt) {
    this.btnSave = true;
    this.btnUpdated = true;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.smallBox = dt;
    this.smallBox.valor_mov = parseFloat(dt['valor_mov']).toFixed(2);
    this.smallBox.sub_total = parseFloat(dt['sub_total']).toFixed(2);
    this.smallBox.iva_valor = parseFloat(dt['iva_valor']).toFixed(2);
    this.smallBox.total = parseFloat(dt['total']).toFixed(2);

    this.smallBox.monto = parseFloat(this.dataDT[0]['monto']).toFixed(2);
    this.smallBox.saldo = parseFloat(this.dataDT[0]['saldo']).toFixed(2);
    this.smallBox.reposicion = (parseFloat(this.dataDT[0]['monto']) - parseFloat(this.dataDT[0]['saldo'])).toFixed(2);
    (this.smallBox.fk_tipo_doc == 21 || this.smallBox.fk_tipo_doc == 0) ? this.disbInfo = true : this.disbInfo = false;
  }


  deleteInfo(dt) {
    this.confirmSave("Seguro desea eliminar el registro del vale?", "DELETE_CAJA_MOV", dt);
  }

  deleteVale(dt) {
    this.lcargando.ctlSpinner(true);
    let data = {
      info: dt,
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación de vale caja chica por el usuario ${this.dataUser.id_usuario}`,
      id_controlador: myVarGlobals.fEgresoCajaChica
    }
    this.vlSrv.deleteValeCaja(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getreposition() {
    if (this.smallBox.fk_caja_chica == 0) {
      this.toastr.info("Seleccione una caja chica");
    } else {
      const modalInvoice = this.modalService.open(ReposicionComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.reposition = this.dataDT;
      modalInvoice.componentInstance.permisions = this.permisions.guardar;
      modalInvoice.componentInstance.form = myVarGlobals.fEgresoCajaChica;
    }
  }
}
