import { Component, OnInit, ViewChild } from '@angular/core';
import { BancariasService } from './bancarias.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ShowCuentasComponent } from '../bancarias/show-cuentas/show-cuentas.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';


import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
standalone: false,
  selector: 'app-bancarias',
  templateUrl: './bancarias.component.html',
  styleUrls: ['./bancarias.component.scss'],
  providers: [DialogService]
})
export class BancariasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  arrayCountrys: any;
  banco: any = { status: 1, tipo_cuenta: "Ahorros", fk_pais_moneda: 1, saldo_cuenta: 0.00 };
  actions: any = { btnGuardar: true, btnMod: false };
  arrayTipAcc: any;
  accDetails: Array<any> = [];
  validaDt: any = false;
  dataAccBanks: any;
  vmButtons: any;


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private accSrv: BancariasService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commVarServ: CommonVarService,
    public dialogService: DialogService,
  ) {
    this.commVarServ.setAccountBanks.asObservable().subscribe(res => {
      this.banco.cuenta_contable = res.codigo;
      this.banco.name_acc = res.nombre;
      this.getAccountingAccount(res.codigo);
    })
  }

  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnIngBacn", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnIngBacn", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnIngBacn", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);
    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validaSaveAccount();
        break;
      case "MODIFICAR":
        this.validaUpdateAccount();
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
      codigo: myVarGlobals.fCuentaBancos,
      id_rol: id_rol
    }

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cuenta banco");
        this.vmButtons = [];
      } else {
        this.getCurrencys();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCurrencys() {
    this.accSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data']
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCountry(evt) {
    this.banco.moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['codigo_iso'];
    this.banco.name_pais_moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['nom_pais'];
  }

  getAccountingAccount(evt) {
    this.banco.name_cuenta = this.accDetails.filter(e => e.codigo == evt)[0]['nombre'];
  }

  getCatalogos() {
    let data = {
      params: "'TIPO CUENTA'"
    }
    this.accSrv.getCatalogos(data).subscribe(res => {
      this.arrayTipAcc = res['data']['TIPO CUENTA'];
      this.getAccountsTypeDetails();
      this.getCountry(1);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true
      this.toastr.info(error.error.message)
    })
  }

  cancel() {
    this.banco = { status: 1, tipo_cuenta: "Ahorros", fk_pais_moneda: 1, saldo_cuenta: 0.00 };
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.getCountry(1);
  }

  getAccountsTypeDetails() {
    let data = { company_id: this.dataUser.id_empresa };
    this.accSrv.getAccountsByDetails(data).subscribe(res => {
      this.accDetails = res['data'];
      this.getDatabitacora();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDatabitacora() {

    (this as any).mensajeSpinner = "Cargando";
    this.lcargando.ctlSpinner(true);
    this.accSrv.getBanks().subscribe(res => {

      this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.validaDt = true;
        this.dataAccBanks = res['data'];

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;

      });
  }

  async validaSaveAccount() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {

      this.banco.name_jefe_cuenta = 'NINGUNO'
      this.banco.telf_jefe_cuenta = '0999999999'

      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la cuenta?", "SAVE_ACCOUNT");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.banco.name_banks == "" || this.banco.name_banks == undefined) {
        this.toastr.info("Ingrese nombre del banco");
        document.getElementById("idnamebanks").focus(); return;
      } else if (this.banco.num_cuenta == "" || this.banco.num_cuenta == undefined) {
        this.toastr.info("Ingrese número de cuenta");
        document.getElementById("Idnumcuenta").focus(); return;
      } else if (this.banco.cuenta_contable == "" || this.banco.cuenta_contable == undefined) {
        this.toastr.info("Seleccione una cuenta contable");
      } else if (this.banco.name_jefe_cuenta == "" || this.banco.name_jefe_cuenta == undefined) {
        this.toastr.info("Ingrese nombre jefe de cuenta");
        document.getElementById("idcuentacontable").focus(); return;
      } else if (this.banco.telf_jefe_cuenta == "" || this.banco.telf_jefe_cuenta == undefined) {
        this.toastr.info("Ingrese número de teléfono del jefe de cuenta");
        document.getElementById("idtelfjefe").focus(); return;
      } else {
        resolve(true);
      }
    });
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_ACCOUNT") {
          this.saveAccount();
        } else if (action == "UPDATED_ACCOUNT") {
          this.updatedAccount();
        }
      }
    })
  }

  saveAccount() {
    this.banco.saldo_cuenta = 0;
    let data = {
      info:this.banco,
      ip: this.commonServices.getIpAddress(),
      accion: "Creación de nueva cuenta bancaria",
      id_controlador: myVarGlobals.fCuentaBancos
    }
    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.accSrv.saveAccount(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.getDatabitacora();
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  onClicConsultaPlanCuentas(content) {

    let busqueda = (typeof this.banco.cuenta_contable === 'undefined') ? "" : this.banco.cuenta_contable;

    let consulta = {
      busqueda: this.banco.cuenta_contable
    }

    localStorage.setItem("busqueda_cuetas", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {

        console.log(cuentas);
        this.banco.cuenta_contable = cuentas["data"].codigo;
        this.banco.name_acc = cuentas["data"].nombre;


        this.getAccountingAccount(cuentas["data"].codigo);



      }

    });
  }

  setAccount(info) {
    this.actions.btnMod = true;
    this.actions.btnGuardar = false;
    this.banco = info;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
  }

  async validaUpdateAccount() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
        }
      })
    }
  }

  updatedAccount() {
    let data = {
      info:this.banco,
      ip: this.commonServices.getIpAddress(),
      accion: "Actualización de nueva cuenta bancaria",
      id_controlador: myVarGlobals.fCuentaBancos
    }
    (this as any).mensajeSpinner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.accSrv.updatedAccount(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.getDatabitacora();
      this.cancel();
    }, error => {
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }
  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }

  // showAccounts() {
  //   const modalInvoice = this.modalService.open(ShowCuentasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
  // }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: any) => {
  //     dtInstance.destroy();
  //     this.getDatabitacora();
  //   });
  // }

}
