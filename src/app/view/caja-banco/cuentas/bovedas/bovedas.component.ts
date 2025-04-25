import { Component, OnInit, ViewChild } from '@angular/core';
import { BovedasService } from './bovedas.service';
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
import { ShowCuentasComponent } from '../bovedas/show-cuentas/show-cuentas.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
  selector: 'app-bovedas',
  templateUrl: './bovedas.component.html',
  styleUrls: ['./bovedas.component.scss']
})
export class BovedasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  arrayCountrys: any;
  boveda: any = { status: 1, tipo_cuenta: "Boveda", fk_pais_moneda: 1, saldo_cuenta: "0.00", name_jefe_cuenta: 0, telf_jefe_cuenta: "09xxxxxx99", num_cuenta: "111xxxx999",name_account:"nombre cuenta" };
  actions: any = { btnGuardar: true, btnMod: false };
  arrayTipAcc: any;
  accDetails: Array<any> = [];
  validaDt: any = false;
  dataAccBanks: any;
  sucursales: any;

  vmButtons: any;
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private accSrv: BovedasService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commVarServ: CommonVarService
  ) {
    this.commVarServ.setAccountBanks.asObservable().subscribe(res => {
      this.boveda.cuenta_contable = res.codigo;
      this.boveda.name_cuenta = res.nombre;
      this.getAccountingAccount(res.codigo);
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnBovCta", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnBovCta", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnBovCta", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
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
      codigo: myVarGlobals.fBovedas,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false); 
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cuenta boveda");
        this.vmButtons = [];
      } else {
        this.processing = true;
        this.getCurrencys();
      }
    }, error => {
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
    this.boveda.moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['codigo_iso'];
    this.boveda.name_pais_moneda = this.arrayCountrys.filter(e => e.id == evt)[0]['nom_pais'];
  }

  getAccountingAccount(evt) {
    this.boveda.name_cuenta = this.accDetails.filter(e => e.codigo == evt)[0]['nombre'];
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
    this.boveda = { status: 1, tipo_cuenta: "Boveda", fk_pais_moneda: 1, saldo_cuenta: "0.00", name_jefe_cuenta: 0, telf_jefe_cuenta: "09xxxxxx99", num_cuenta: "111xxxx999",name_account:"nombre cuenta" };
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.getCountry(1);
  }

  getAccountsTypeDetails() {
    let data = { company_id: this.dataUser.id_empresa };
    this.accSrv.getAccountsByDetails(data).subscribe(res => {
      this.accDetails = res['data'];
      this.getsucursales();
    }, error => {
      this.lcargando.ctlSpinner(false); 
      this.toastr.info(error.error.message);
    })
  }

  getsucursales() {
    let data = {
      id_empresa: this.dataUser.id_empresa,
    }
    this.accSrv.getSucursal(data).subscribe(res => {
      this.sucursales = res['data'];
      this.getDatabitacora();
    }, error => {
      this.lcargando.ctlSpinner(false); 
      this.toastr.info(error.error.message);
    })
  }

  getDatabitacora() {
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
    this.mensajeSppiner = "Cargando";
    this.lcargando.ctlSpinner(true); 
    this.accSrv.getBovedas().subscribe(res => {
      this.lcargando.ctlSpinner(false); 
      this.validaDt = true;
      this.dataAccBanks = res['data'];
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false); 
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
    });
  }

  async validaSaveAccount() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
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
      if (this.boveda.name_banks == "" || this.boveda.name_banks == undefined) {
        this.toastr.info("Ingrese nombre del boveda");
        document.getElementById("idnamebanks").focus(); return;
      } else if (this.boveda.name_jefe_cuenta == 0) {
        this.toastr.info("Seleccione una sucursal");
      } else if (this.boveda.cuenta_contable == "" || this.boveda.cuenta_contable == undefined) {
        this.toastr.info("Seleccione una cuenta contable");
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
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      //this.processing = false;
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
    this.boveda.saldo_cuenta = 0;
    let data = {
      info: this.boveda,
      ip: this.commonServices.getIpAddress(),
      accion: `Creación de nueva cuenta boveda en la sucursal ${this.boveda.name_jefe_cuenta}`,
      id_controlador: myVarGlobals.fBovedas
    }
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);  
    this.accSrv.saveAccount(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.lcargando.ctlSpinner(false);  
      this.cancel();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getAccountsTypeDetails();
        this.getCountry(1);
      });
    }, error => {
      this.lcargando.ctlSpinner(false);  
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  setAccount(info) {
    console.log(info);
    this.actions.btnMod = true;
    this.actions.btnGuardar = false;
    this.boveda = info;
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
      info: this.boveda,
      ip: this.commonServices.getIpAddress(),
      accion: "Actualización de nueva cuenta bancaria",
      id_controlador: myVarGlobals.fBovedas
    }
    this.validaDt = false;
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);  
    this.accSrv.updatedAccount(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getAccountsTypeDetails();
        this.getCountry(1);
      });
    }, error => {
      this.lcargando.ctlSpinner(false);  
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  showAccounts() {
    const modalInvoice = this.modalService.open(ShowCuentasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
  }
}
