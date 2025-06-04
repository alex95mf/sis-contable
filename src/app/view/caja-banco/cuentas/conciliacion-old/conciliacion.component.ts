import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ConciliacionService } from './conciliacion.service';
import { CommonService } from '../../../../services/commonServices';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { formatDate } from '@angular/common';

@Component({
standalone: false,
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.scss']
})
export class ConciliacionComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataUser: any;
  processing: any = false;
  bankSelect: any = null;
  permisions: any;
  viewDate: Date = new Date();
  fromDatePicker: any = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
  toDatePicker: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  arrayBanks: any;
  validaDt: any = false;
  infoDt: any;
  status_conciliaton: any = 0;
  saldo_bank: any = '0.00';
  checkGlobal: any = false;
  btnDisabled: any = false;

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private cslSrv: ConciliacionService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPermisions();
  }

  getPermisions() {

    this.vmButtons = [
      { orig: "btnConciBanc", paramAccion: "", boton: { icon: "fal fa-money-check-edit", texto: "CONCILIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);


    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fConciliacionBank,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de conciliación bancaria");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getInfoBank();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "BUSCAR":
        this.rerenderFech();
        break;
      case "CONCILIAR":
        this.validateSave();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  getInfoBank() {
    this.cslSrv.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe(res => {
      this.arrayBanks = res['data'];
      this.bankSelect = 0;
      if (this.arrayBanks.length > 0) {
        this.bankSelect = this.arrayBanks[0].id_banks;
      }
      if (this.bankSelect != 0) {
        this.saldo_bank = this.arrayBanks.filter(e => e.id_banks == this.bankSelect)[0]['saldo_cuenta'];
      } else {
        this.saldo_bank = '0.00';
      }
      this.getTableConciliation();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTableConciliation() {
    this.checkGlobal = false;
    let data = {
      date: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      date2: moment(this.toDatePicker).format('YYYY-MM-DD'),
      status: this.status_conciliaton,
      id_bank: this.bankSelect
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      /* scrollY: "200px",
      scrollCollapse: true, */
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
      }
    };
    this.mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.cslSrv.getConciliation(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.infoDt = res['data'];
      localStorage.setItem('conciliation', JSON.stringify(this.infoDt));
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.validaDt = true;
      this.infoDt = [];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    });
  }

  rerenderBank(evt) {
    if (evt != 0) {
      this.saldo_bank = this.arrayBanks.filter(e => e.id_banks == evt)[0]['saldo_cuenta'];
    } else {
      this.saldo_bank = '0.00';
    }
    this.rerender();
  }

  rerenderFech() {
    this.status_conciliaton = null;
    this.rerender();
  }

  rerender(): void {
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableConciliation();
    });
  }

  consultConciliado(status) {
    this.lcargando.ctlSpinner(true);
    this.status_conciliaton = status;
    this.rerender();
  }

  selectAll() {
    this.checkGlobal = !this.checkGlobal;
    if (this.checkGlobal) {
      this.infoDt.forEach(element => {
        element['status_conciliacion'] = true;
      });
    } else {
      this.validaDt = false;
      this.infoDt = [];
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.validaDt = true;
        this.infoDt = JSON.parse(localStorage.getItem('conciliation'));
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      });
    }
  }

  cancel() {
    this.saldo_bank = '0.00';
    this.checkGlobal = false;
    this.btnDisabled = false;
    this.validaDt = false;
    this.fromDatePicker = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
    this.toDatePicker = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.status_conciliaton = 0;
    this.rerender();
  }

  validateSave() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para modificar los registros");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea realizar la conciliación?",
        type: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateConciliation();
        }
      })
    }
  }

  updateConciliation() {
    this.lcargando.ctlSpinner(true);
    let data = {
      info: this.infoDt,
      ip: this.commonServices.getIpAddress(),
      accion: `Conciliación bancaria por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fConciliacionBank
    }
    this.cslSrv.saveConciliation(data).subscribe(res => {
      localStorage.removeItem('conciliation');
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeStus(dt, index) {
    this.infoDt.forEach(element => {
      if (element['num_doc'] == dt.num_doc && element['num_doc'] != null) {
        element['status_conciliacion'] = dt.status_conciliacion
      } else {
        this.infoDt[index]['status_conciliacion'] = dt.status_conciliacion;
      }
    });
  }
}
