import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import * as moment from 'moment';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CierreService } from './cierre.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ForceCierreComponent } from './force-cierre/force-cierre.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-cierre',
  templateUrl: './cierre.component.html',
  styleUrls: ['./cierre.component.scss']
})

export class CierreComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: any = new Date();
  processing: any = false;
  dataUser: any;
  permisions: any;
  caja: any = { punto_emision: 0, valor_cierre: 0.00, supervisor: 0, valor_inconsistencia: 0.00, egresos_box: 0.00 };
  arrayCajas: any = [];
  arrayModals: any = {};
  actions: any = { cierre: false, btncierre: false };
  forceClose: any = false;
  arrayUsers: any;
  observation: any = "";
  arraySum: any;
  arraySumDet: any = [];
  arrayChequesPost: any;
  vmButtons: any;
  numCajaRegister: any;
  numSucursal: any;
  arrayView: any = { egr: parseFloat('0.00'), ing: parseFloat('0.00'), cierre: parseFloat('0.00'), cuadre: parseFloat('0.00'), diferencia: parseFloat('0.00'), apertura: parseFloat('0.00'), total_others: parseFloat('0.00') };
  totalClose: any = '0.00';

  validaDt: any = false;
  dataClosetBox: any;
  changeAll: any = false;
  arrayTipeDoc: any;
  valueInconAux: any = parseFloat('0');
  empresLogo: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  dateNow: any;


  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private cierreSrv: CierreService,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal
  ) {

    this.commonVarSrv.setSupervisorBox.asObservable().subscribe(res => {
      this.caja = res;
      this.changeAll = true;
      this.arraySumDet.forEach(element => {
        element['validate_sum'] = true;
      });
      this.caja.valor_cierre = parseFloat(this.caja.valor_cierre);
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia);
      this.arrayView.cierre = parseFloat(this.caja.valor_cierre).toFixed(2);
      this.arrayView.diferencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);

    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR CAJA":
        this.validateCloseBox();
        break;
      case "FORZAR CIERRE":
        this.showForceCierre();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  ngOnInit(): void {
    this.dateNow = moment(this.hoy).format('YYYY-MM-DD');
    this.vmButtons = [
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CERRAR CAJA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      /* { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-money-bill-alt", texto: "DEPOSITO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false }, */
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-user-lock", texto: "FORZAR CIERRE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.getPermisions();
    }, 50);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCierreCaja,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cierre de cajas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getUserOpenBox();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUserOpenBox() {
    this.caja.fk_usuario_caja = this.dataUser.id_usuario;
    this.caja.fk_sucursal = this.dataUser.id_sucursal;
    this.caja.fk_empresa = this.dataUser.id_empresa;
    this.cierreSrv.getInfoUserOpenBox(this.caja).subscribe(res => {
      this.caja = res['data'][0];
      this.numCajaRegister = this.caja.id.toString().padStart(10, '0');
      this.numSucursal = this.caja.fk_sucursal.toString().padStart(3, '0');
      this.arrayView.total_others = res['data'].total_ing_pend;
      this.caja.fecha_cierre = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
      this.caja.isOpen = 0;
      this.caja.supervisor = 0;

      this.arraySum = res['data'][0]['det_f_pago_sum'];
      this.arrayChequesPost = res['data'][0]['det_cheques_post'];
      this.getUsuario(res['data'][0]['det_f_pago_det']);
    }, error => {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        title: 'Error!!',
        text: error.error.message + ", será reridigido a la apertura de caja ",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('bancos/cajageneral/apertura');
        }
      })
    })
  }

  getUsuario(info) {
    this.cierreSrv.getUsuario().subscribe(res => {
      this.arrayUsers = res['data'];
      this.arrayUsers = this.arrayUsers.filter(e => e.id_usuario != this.dataUser.id_usuario);
      this.caja.valor_inconsistencia = parseFloat('0');
      this.caja.valor_inconsistencia = (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta));
      this.caja.valor_inconsistencia = this.caja.valor_inconsistencia * (-1);
      this.arrayView.diferencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
      this.caja.total_venta = parseFloat(this.caja.total_venta).toFixed(2);
      this.caja['total_venta_periodo'] = (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta));
      this.valueInconAux = this.caja.total_venta_periodo * (-1);
      this.arrayView.cuadre = this.caja.valor_inconsistencia * (-1);
      this.arrayView.ing = parseFloat(this.caja['total_venta_periodo']).toFixed(2);
      this.arrayView.apertura = parseFloat(this.caja.valor_apertura).toFixed(2);
      this.arrayView.egr = this.caja.egresos_box;
      this.caja['cuentas'] = [];
      this.getTipeDoc(info);
    }, error => {
      this.processing = true;
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTipeDoc(info) {
    this.cierreSrv.getTipeDoc().subscribe(res => {
      this.arrayTipeDoc = res['data'];
      this.getRegister(info);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getRegister(info) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      dom: 'lfrtip',
      order: [[0, "desc"]],
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.lcargando.ctlSpinner(false);
    this.validaDt = true;
    this.arraySumDet = info;
    this.arraySumDet.forEach(element => {
      element['validate_sum'] = false;
    });
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
  }

  showForceCierre() {
    const modalInvoice = this.modalService.open(ForceCierreComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.caja = this.caja;
    modalInvoice.componentInstance.arrayUsers = this.arrayUsers;
  }

  cancel() {
    this.caja['cuentas'] = [];
    this.arrayModals = null;
    this.caja.valor_cierre = 0;
    this.arrayView.cierre = this.caja.valor_cierre;
    this.caja.egresos_box = 0;
    this.arrayView.egr = this.caja.egresos_box;
    this.caja.supervisor = 0;
    this.caja.pass = "";
    this.caja.concep_force_box = (this.caja.concep_force_box != undefined) ? "" : "";
    this.observation = "";
    this.caja.fecha_cierre = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
    this.caja.valor_inconsistencia = parseFloat('0');
    this.caja.valor_inconsistencia = (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta));
    this.caja.valor_inconsistencia = this.caja.valor_inconsistencia * (-1);
    this.arrayView.diferencia = this.caja.valor_inconsistencia;
    this.changeAll = false;
    this.arraySumDet.forEach(element => {
      element['validate_sum'] = false;
    });
  }

  getTipeDocTable(evt) {
    return this.arrayTipeDoc.filter(e => e.id == evt)[0]['codigo'];
  }

  changeValAll() {
    this.caja.valor_cierre = parseFloat('0');
    this.arrayView.cierre = parseFloat('0');
    this.caja.valor_inconsistencia = parseFloat('0');
    this.arrayView.diferencia = parseFloat('0');
    let valAux = parseFloat('0');
    this.changeAll = !this.changeAll;
    if (this.changeAll) {
      this.arraySumDet.forEach(element => {
        element['validate_sum'] = true;
        this.caja.valor_cierre = parseFloat(this.caja.valor_cierre) + parseFloat(element.valor);
        valAux = parseFloat(valAux.toString()) + parseFloat(element.valor);
        this.caja.valor_inconsistencia = parseFloat(this.caja.total_venta_periodo) - parseFloat(valAux.toString())
      });
      this.caja.valor_cierre = parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.valor_apertura);
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia) - parseFloat(this.caja.valor_apertura);
      this.arrayView.cierre = parseFloat(this.caja.valor_cierre).toFixed(2);
      this.arrayView.diferencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
    } else {
      this.caja.concep_force_box = "";
      this.caja.pass = "";
      this.caja.supervisor = 0;

      this.arraySumDet.forEach(element => {
        element['validate_sum'] = false;
        this.caja.valor_cierre = parseFloat('0');
        valAux = parseFloat(valAux.toString()) + parseFloat(element.valor);
        this.caja.valor_inconsistencia = parseFloat(this.caja.valor_cierre) - parseFloat(valAux.toString());
      });
      this.caja.valor_cierre = parseFloat(this.caja.valor_cierre);
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia) - parseFloat(this.caja.valor_apertura);
      this.arrayView.cierre = parseFloat(this.caja.valor_cierre).toFixed(2);
      this.arrayView.diferencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
    }
  }

  changeVal(index) {
    this.arraySumDet[index]['validate_sum'] = !this.arraySumDet[index]['validate_sum'];
    this.caja.valor_cierre = parseFloat('0');
    this.arrayView.cierre = parseFloat('0');
    this.caja.valor_inconsistencia = this.valueInconAux;
    this.arrayView.diferencia = parseFloat('0');
    let valAux = parseFloat('0');
    this.arraySumDet.forEach(element => {
      if (element['validate_sum']) {
        this.caja.valor_cierre = parseFloat(this.caja.valor_cierre) + parseFloat(element.valor);
        this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia) + parseFloat(element.valor)
      }
    });
    this.caja.valor_cierre = parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.valor_apertura);
    this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia) + parseFloat(this.caja.valor_apertura);
    this.arrayView.cierre = parseFloat(this.caja.valor_cierre).toFixed(2);
    this.arrayView.diferencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
  }

  validateCloseBox() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no permiso para cerrar la caja");
    } else {
      Swal.fire({
        text: 'Seguro no quiere imprimir el documento de cierre de caja?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar cierre',
        showLoaderOnConfirm: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        preConfirm: () => {
          if (parseFloat(this.caja.valor_inconsistencia) < 0 && this.caja.supervisor == 0) {
            Swal.fire({
              title: 'Atención!!',
              text: "La caja no cuadra, debe forzar el cierre de caja autorizado por un supervisor!!",
              icon: 'warning',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
            })
          } else {
            Swal.fire({
              title: "Atención!!",
              text: "Seguro desea cerrar la caja?",
              icon: 'warning',
              showCancelButton: true,
              cancelButtonColor: '#DC3545',
              confirmButtonColor: '#13A1EA',
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                this.lcargando.ctlSpinner(true);
                this.viewDate = new Date();
                if (parseFloat(this.caja.valor_inconsistencia) == 0 && this.caja.supervisor != 0) {
                  this.caja.supervisor = 0;
                  this.caja.pass = "";
                }
                this.caja['fecha_cierre'] = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
                this.caja['isOpen'] = 0;
                this.caja['observacion'] = (this.caja.concep_force_box != undefined) ? `${this.observation} ${this.caja.concep_force_box}` : this.observation;
                this.caja['force'] = (this.caja.supervisor != 0) ? 1 : 0;
                this.caja['fk_user_supervisor'] = this.caja.supervisor;
                this.caja['status_box'] = "Cerrado";
                (parseFloat(this.caja.valor_inconsistencia) < 0) ? this.caja['cuadre_caja'] = 'N' : this.caja['cuadre_caja'] = 'S';
                if (parseFloat(this.caja.valor_inconsistencia) < 0 && this.caja.supervisor != 0) {
                  this.caja['cuadre_caja'] = 'N';
                  this.caja['valor_inconsistencia'] = Math.abs(this.caja['valor_inconsistencia']);
                  this.caja['valor_inconsistencia'] = this.caja['valor_inconsistencia'].toFixed(2);
                }

                let infoPrestamo = {};
                let detPrestamo = {};
                let arrayDet = [];

                if (this.caja['cuadre_caja'] == 'N') {
                  this.toDatePicker = moment(this.viewDate).add(1, "months");

                  detPrestamo['estado'] = "Pendiente";
                  detPrestamo['fecha_vencimiento'] = moment(this.viewDate).format('YYYY-MM-DD');
                  detPrestamo['letra_mes'] = this.semanalNum(this.toDatePicker);
                  detPrestamo['monto'] = this.caja['valor_inconsistencia'];
                  detPrestamo['num_cuota'] = 1;
                  arrayDet.push(detPrestamo);

                  infoPrestamo['abono'] = 0;
                  infoPrestamo['accion'] = `Registro nuevo prestamos empleado ${this.caja.name_user_caja} por faltante en caja`;
                  infoPrestamo['cuotas'] = 1;
                  infoPrestamo['cuotas_paga'] = this.caja['valor_inconsistencia'];
                  infoPrestamo['detalle'] = null;
                  infoPrestamo['dt_prestamos'] = arrayDet;
                  infoPrestamo['fecha_inicio'] = moment(this.viewDate).format('YYYY-MM-DD');
                  infoPrestamo['id_controlador'] = myVarGlobals.fCierreCaja;
                  infoPrestamo['id_empleado'] = this.caja['fk_usuario_caja'];
                  infoPrestamo['interes'] = 0;
                  infoPrestamo['ip'] = this.commonServices.getIpAddress();
                  infoPrestamo['monto'] = this.caja['valor_inconsistencia'];
                  infoPrestamo['monto_total'] = this.caja['valor_inconsistencia'];
                  infoPrestamo['porcentaje'] = 0;
                  infoPrestamo['saldo'] = this.caja['valor_inconsistencia'];
                  infoPrestamo['tipo'] = "PAE";
                  infoPrestamo['tipo_pago'] = "Mensual";
                  this.caja['prestamo'] = infoPrestamo;
                }

                let data = {
                  info: this.caja,
                  ip: this.commonServices.getIpAddress(),
                  accion: `Cierre de caja por el usuario ${this.dataUser.nombre}`,
                  id_controlador: myVarGlobals.fCierreCaja
                }

                this.cierreSrv.closeBox(data).subscribe(res => {
                  this.toastr.success(res['message']);
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    title: 'Muy bien!!',
                    text: "La caja ha sido cerrada con éxito, será reridigido a la apertura de caja ",
                    icon: 'success',
                    confirmButtonColor: '#28A745',
                    confirmButtonText: 'Aceptar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigateByUrl('bancos/cajageneral/apertura');
                    }
                  })
                }, error => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                })
              }
            })
          }
        },
      })
    }
  }

  semanalNum(date) {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth();
    let day = new Date(date).getDate();
    let weekNum = 1;
    let weekDay = new Date(year, month - 1, 1).getDay();
    weekDay = weekDay === 0 ? 6 : weekDay - 1;
    let monday = 1 + (7 - weekDay);
    while (monday <= day) {
      weekNum++;
      monday += 7;
    }
    return weekNum;
  }

}




/* import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import * as moment from 'moment';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CierreService } from './cierre.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowDenominationCierreComponent } from './show-denomination-cierre/show-denomination-cierre.component';
import { ShowCajaBancoComponent } from './show-caja-banco/show-caja-banco.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ShowDetailPaymentComponent } from './show-detail-payment/show-detail-payment.component';
import { ForceCierreComponent } from './force-cierre/force-cierre.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-cierre',
  templateUrl: './cierre.component.html',
  styleUrls: ['./cierre.component.scss']
})

export class CierreComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  processing: any = false;
  dataUser: any;
  permisions: any;
  caja: any = { punto_emision: 0, valor_cierre: 0.00, supervisor: 0, valor_inconsistencia: 0.00, egresos_box: 0.00 };
  arrayCajas: any = [];
  arrayModals: any = {};
  actions: any = { cierre: false, btncierre: false };
  forceClose: any = false;
  arrayUsers: any;
  observation: any = "";
  arrayDet: any;
  arrayDetPendiente: any;
  vmButtons: any;
  detailPayment: any;
  numCajaRegister:any;
  numSucursal:any;
  arrayView: any = { egr: parseFloat('0.00'), ing: parseFloat('0.00'), cierre: parseFloat('0.00'), cuadre: parseFloat('0.00'), diferencia: parseFloat('0.00'), apertura: parseFloat('0.00'), total_others: parseFloat('0.00') };
  totalClose:any = '0.00';

  validaDt:any = false;
  dataClosetBox:any;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private cierreSrv: CierreService,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVarSrv.setValueCajaCierre.asObservable().subscribe(res => {
      this.caja['cuentas'] = [];
      this.arrayModals = res;
      this.caja.valor_cierre = this.arrayModals['total'];
      this.arrayView.cierre = this.caja.valor_cierre;
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    })

    this.commonVarSrv.setTotalAccount.asObservable().subscribe(res => {
      this.caja.valor_cierre = parseFloat(res['total']).toFixed(2);
      this.arrayView.cierre = this.caja.valor_cierre;
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CERRAR CAJA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-money-bill-alt", texto: "DEPOSITO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-user-lock", texto: "FORZAR CIERRE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-secondary boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnCierreCaja", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.getPermisions();
    }, 50);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCierreCaja,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cierre de cajas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getUserOpenBox();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUserOpenBox() {
    this.caja.fk_usuario_caja = this.dataUser.id_usuario;
    this.caja.fk_sucursal = this.dataUser.id_sucursal;
    this.caja.fk_empresa = this.dataUser.id_empresa;
    this.cierreSrv.getInfoUserOpenBox(this.caja).subscribe(res => {
      this.caja = res['data'][0];
      this.numCajaRegister = this.caja.id.toString().padStart(10, '0');
      this.numSucursal = this.caja.fk_sucursal.toString().padStart(3, '0');
      this.arrayView.total_others = res['data'].total_ing_pend;
      this.caja.fecha_cierre = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
      this.caja.isOpen = 0;
      this.caja.supervisor = 0;
      this.arrayDet = res['data'][0]['det_f_pago'];
      this.arrayDetPendiente = res['data'][0]['det_f_pago_pendt'];
      this.detailPayment = res['data'][0]['detail_f_payment'];
      this.getUsuario();
    }, error => {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        title: 'Error!!',
        text: error.error.message + ", será reridigido a la apertura de caja ",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('bancos/cajageneral/apertura');
        }
      })
    })
  }

  getUsuario() {
    this.cierreSrv.getUsuario().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayUsers = res['data'];
      this.arrayUsers = this.arrayUsers.filter(e => e.id_usuario != this.dataUser.id_usuario);
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
      this.caja['total_venta_periodo'] = this.caja.valor_inconsistencia * (-1);
      this.arrayView.cuadre = this.caja.valor_inconsistencia * (-1);
      this.arrayView.ing = this.caja.total_venta;
      this.arrayView.apertura = this.caja.valor_apertura;
      this.arrayView.egr = this.caja.egresos_box;
      this.caja['cuentas'] = [];
      this.getRegister();
    }, error => {
      this.processing = true;
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getRegister() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.lcargando.ctlSpinner(true);
    this.validaDt = true;
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);

  }

  showForceCierre() {
    const modalInvoice = this.modalService.open(ForceCierreComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  showDenominations() {
    this.arrayModals['total_venta_periodo'] = this.caja['total_venta_periodo'];
    this.arrayView.cuadre = parseFloat(this.arrayModals['total_venta_periodo']);
    const modalInvoice = this.modalService.open(ShowDenominationCierreComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.info = this.arrayModals;
  }

  cancel() {
    this.caja['cuentas'] = [];
    this.arrayModals = null;
    this.caja.valor_cierre = 0;
    this.arrayView.cierre = this.caja.valor_cierre;
    this.caja.egresos_box = 0;
    this.arrayView.egr = this.caja.egresos_box;
    this.caja.supervisor = 0;
    this.caja.pass = "";
    this.observation = "";
    this.caja.fecha_cierre = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
    this.caja.valor_inconsistencia = 0;
    this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
    this.arrayView.diferencia = this.caja.valor_inconsistencia;
  }

  changeValue() {
    if (this.caja.valor_cierre === "" || this.caja.valor_cierre === null) {
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (0.00 - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    } else {
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    }
    this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
    this.arrayView.diferencia = this.caja.valor_inconsistencia;
  }

  sumEgresos() {
    if (this.caja.egresos_box === "" || this.caja.egresos_box === null) {
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = 0.00 + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    } else {
      this.caja.valor_inconsistencia = 0;
      this.caja.valor_inconsistencia = parseFloat(this.caja.egresos_box) + (parseFloat(this.caja.valor_cierre) - (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)));
      this.arrayView.diferencia = this.caja.valor_inconsistencia;
    }
    this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
    this.arrayView.diferencia = this.caja.valor_inconsistencia;
  }



  forceCloseFunction() {
    this.forceClose = !this.forceClose;
    if (!this.forceClose) {
      this.caja.supervisor = 0;
      this.caja.pass = "";
    }
  }


  validateCloseBox() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no permiso para editar el estado de la caja");
    } else {
      let validateAmount: any = 0.00;
      if (this.caja['cuentas'].length > 0) {
        this.caja['cuentas'].forEach(element => {
          validateAmount = validateAmount + parseFloat(element['value']);
        });
      }
      if (this.caja['cuentas'].length == 0) {
        this.toastr.info("Debe seleccionar al menos una cuenta para deposito en banco");
      }

      else if (parseFloat(validateAmount) > parseFloat(this.caja.valor_cierre) && this.caja['punto_emision'] != "001") {
        this.toastr.info(`El valor de cierre $${this.caja.valor_cierre} no puede ser mayor al valor ingresado para deposito en banco/s $${validateAmount}`);
      } else if (parseFloat(validateAmount) > parseFloat(this.caja.total_venta) && this.caja['punto_emision'] == "001") {
        this.toastr.info(`El valor de total ventas $${this.caja.total_venta} no puede ser menor al valor ingresado para deposito en banco/s $${validateAmount}`);
      }

      else if (parseFloat(validateAmount) < parseFloat(this.caja.valor_cierre) && this.caja['punto_emision'] != "001") {
        this.toastr.info(`El valor de cierre $${this.caja.valor_cierre} no puede ser mayor al valor ingresado para deposito en banco/s $${validateAmount}`);
      } else if (parseFloat(validateAmount) < parseFloat(this.caja.valor_cierre) && this.caja['punto_emision'] == "001") {
        this.toastr.info(`El valor de cierre $${this.caja.valor_cierre} no puede ser mayor al valor ingresado para deposito en banco/s $${validateAmount}`);
      }

      else if ((validateAmount + parseFloat(this.caja.egresos_box)) > (parseFloat(this.caja.valor_apertura) + parseFloat(this.caja.total_venta)) && this.caja['punto_emision'] != "001") {
        this.toastr.info(`El valor total ingresado en las cuentas de banco mas los egresos $${(validateAmount + parseFloat(this.caja.egresos_box))} superan el monto de cuadre $${this.caja['total_venta_periodo']}`);
      } else if ((validateAmount + parseFloat(this.caja.egresos_box)) > (parseFloat(this.caja.total_venta)) && this.caja['punto_emision'] == "001") {
        this.toastr.info(`El valor total ingresado en las cuentas de banco/s mas los egresos $${(validateAmount + parseFloat(this.caja.egresos_box))} superan el total de las ventas $${this.caja['total_venta']}`);
      }

      else if ((parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.egresos_box)) < parseFloat(validateAmount) && this.caja['punto_emision'] != "001") {
        this.toastr.info(`El valor de cierre mas los egresos $${(parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.egresos_box))} es menor monto del valor ingresado en las cuentas de banco $${validateAmount}`);
      } else if ((parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.egresos_box)) < parseFloat(validateAmount) && this.caja['punto_emision'] == "001") {
        this.toastr.info(`El valor de cierre mas los egresos $${(parseFloat(this.caja.valor_cierre) + parseFloat(this.caja.egresos_box))} es menor al total de las ventas $${this.caja.total_venta}`);
      }

      else if ((parseFloat(this.caja.valor_inconsistencia) < 0.00 || parseFloat(this.caja.egresos_box) > 0.00) && !this.forceClose && this.caja['punto_emision'] != "001") {
        Swal.fire({
          title: 'Error!!',
          text: "Existe una inconsistencia, es posible que la caja no cuadre o haya un egreso, debe forzar el cierre de caja autorizado por un supervisor!!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          document.getElementById("IdRolesUsersDoc");
        })
      }

      else if ((parseFloat(this.caja.valor_inconsistencia) < (-1 * parseFloat(this.caja.valor_apertura))
        && !this.forceClose && this.caja['punto_emision'] == "001")) {
        Swal.fire({
          title: 'Error!!',
          text: "Existe una inconsistencia, es posible que la caja no cuadre, debe forzar el cierre de caja autorizado por un supervisor!!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          document.getElementById("IdRolesUsersDoc");
        })
      }

      else if (this.forceClose && this.caja.supervisor == 0) {
        this.toastr.info("Debe seleccionar un supervisor para forzar el cierre de caja");
        document.getElementById("IdRolesUsersDoc");
      } else if (this.forceClose && this.caja.pass == "") {
        this.toastr.info("Ingrese una clave");
        document.getElementById("Idpass").focus();
      } else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea cerrar la caja?",
           icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          this.lcargando.ctlSpinner(true);
          if (result.isConfirmed) {
            this.viewDate = new Date();
            this.caja['fecha_cierre'] = moment(this.viewDate).format('YYYY-MM-DD HH:mm:ss');
            this.caja['isOpen'] = 0;
            this.caja['observacion'] = this.observation;
            this.caja['force'] = (this.forceClose) ? 1 : 0;
            this.caja['fk_user_supervisor'] = this.caja.supervisor;
            if (parseFloat(this.caja.valor_inconsistencia) >= 0.00 && this.caja['punto_emision'] != "001") {
              this.caja['cuadre_caja'] = 'S';
            } else if (parseFloat(this.caja.valor_inconsistencia) <= 0.00 && this.caja['punto_emision'] != "001") {
              this.caja['cuadre_caja'] = 'N';
            }
            if (parseFloat(this.caja.valor_inconsistencia) > (-1 * parseFloat(this.caja.valor_apertura)) && this.caja['punto_emision'] == "001") {
              this.caja['cuadre_caja'] = 'S';
              this.caja['valor_inconsistencia'] = 0.00;
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            } else if (parseFloat(this.caja.valor_inconsistencia) < (-1 * parseFloat(this.caja.valor_apertura)) && this.caja['punto_emision'] == "001") {
              this.caja['cuadre_caja'] = 'N';
              this.caja['valor_inconsistencia'] = ((parseFloat(this.caja['valor_inconsistencia']) * (-1))) - parseFloat(this.caja.valor_apertura);
              this.caja['valor_inconsistencia'] = parseFloat(this.caja['valor_inconsistencia']).toFixed(2);
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            } else if (parseFloat(this.caja.valor_inconsistencia) == (-1 * parseFloat(this.caja.valor_apertura)) && this.caja['punto_emision'] == "001") {
              this.caja['cuadre_caja'] = 'S';
              this.caja['valor_inconsistencia'] = 0.00;
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            }

            if (parseFloat(this.caja['valor_inconsistencia']) < 0.00 && this.caja['punto_emision'] != "001") {
              this.caja['valor_inconsistencia'] = (this.caja['valor_inconsistencia'] * (-1));
              this.caja['valor_inconsistencia'] = parseFloat(this.caja['valor_inconsistencia']).toFixed(2);
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            } else if (parseFloat(this.caja['valor_inconsistencia']) > 0.00 && this.caja['punto_emision'] != "001") {
              this.caja['valor_inconsistencia'] = 0.00;
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            } else if (parseFloat(this.caja['valor_inconsistencia']) == 0.00 && this.caja['punto_emision'] != "001") {
              this.caja['valor_inconsistencia'] = 0.00;
              this.arrayView.diferencia = this.caja.valor_inconsistencia;
            }

            let data = {
              info: this.caja,
              ip: this.commonServices.getIpAddress(),
              accion: `Cierre de caja por el usuario ${this.dataUser.nombre}`,
              id_controlador: myVarGlobals.fCierreCaja
            }

            this.cierreSrv.closeBox(data).subscribe(res => {
              this.toastr.success(res['message']);
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                title: 'Muy bien!!',
                text: "La caja ha sido cerrada con éxito, será reridigido a la apertura de caja ",
                icon: 'success',
                confirmButtonColor: '#28A745',
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigateByUrl('bancos/cajageneral/apertura');
                }
              })
            }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }

  showBoxBank() {
    const modalInvoice = this.modalService.open(ShowCajaBancoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.info = this.caja;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR CAJA":
        this.validateCloseBox();
        break;
      case "DEPOSITO":
        this.showBoxBank();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  sendDetail() {
    const modalInvoice = this.modalService.open(ShowDetailPaymentComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.dataDT = this.detailPayment;
  }

}
 */
