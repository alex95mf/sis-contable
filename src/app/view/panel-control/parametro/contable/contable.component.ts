import { Component, OnInit, OnDestroy, ViewChild, NgZone  } from '@angular/core';
import { Subject } from "rxjs";
import moment from "moment";
import { Router } from "@angular/router";
import "moment/locale/es";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { contableConfService } from "./contable.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { Socket } from "../../../../services/socket.service";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ParametroCuentaComponent } from './parametro-cuenta/parametro-cuenta.component';
import Swal from 'sweetalert2';

@Component({
standalone: false,
	selector: 'app-contable',
	templateUrl: './contable.component.html',
	styleUrls: ['./contable.component.scss']
})
export class ContableComponent implements OnInit {
	
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
	/* Datatable options */
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	vmButtons: any = [];
	dataUser: any;
	permisions: any;
	processing: any = false;
	paramCuenta: Array < any > = [];
	arrayData: Array < any > = [];
	validaDtUser: any;
	parametro: any = {};

	constructor(private toastr: ToastrService,
		private router: Router,
		private contableConfSrv: contableConfService,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrvice: CommonVarService,
		private socket: Socket,
		private confirmationDialogService: ConfirmationDialogService) {

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

		this.commonVarSrvice.paramsAccount.asObservable().subscribe(res => {
			this.parametro.Codigo = res['codigo'];
			this.parametro.NombreCuentaOficial = res['nombre'];
			this.parametro.tipoCuenta = res['tipo'];
			this.parametro.id_cuenta = res['id'];
		});
	}
  ngOnInit(): void {
    this.vmButtons = [
			{ orig: "btnParametroCuenta", paramAccion: "", boton: { icon: "fas fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnParametroCuenta", paramAccion: "", boton: { icon: "fas fa-pencil-alt", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true, imprimir: false},
			];

      setTimeout(() => {
      this.permissions();
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.limpiarDatos();
        break;
      case "MODIFICAR":
        this.validateUdate();
        break;
    }
  }

  permissions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fRpaContable,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.permisions = res["data"];
      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene permiso para ver Formulario Parametros Cuenta");
        this.vmButtons = [];
        this.processing = false;
      } else {
        this.processing = true;
        this.ParametroCuentas();
        this.getDataTable();
      }
    });
  }

  ParametroCuentas() {
    this.contableConfSrv.presentaTablaParametros().subscribe((res) => {
      this.paramCuenta = res["data"];
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  getDataTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      /* scrollY: "200px",
      scrollCollapse: true, */
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.contableConfSrv.presentaTablaParametros().subscribe(
      res => {
        this.lcargando.ctlSpinner(false);
        this.validaDtUser = true;
        this.arrayData = res["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.ngOnDestroy();
        }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  inforUpdate(dt) {
    document.getElementById("idbtnCuenta").style.border = "2px solid black ";
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.parametro.fk_cuenta_contable = dt.fk_cuenta_contable;
    this.parametro.Codigo = dt.cuenta_contable;
    this.parametro.NombreCuentaOficial = dt.cuentaNombre;
    this.parametro.tipoCuenta = dt.tipoCuenta;
    this.parametro.id_update = dt.id;
    this.parametro.nombre_cuenta = dt.nombre_cuenta;
  }

  // EDIT
  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "MOD_CUENTA") {
          this.updateData();
        }
      }
    });
  }


  updateData() {
    let data = {
      id: this.parametro.id_update,
      cuenta_codigo: this.parametro.Codigo,
      fk_cuenta_contable: this.parametro.id_cuenta,
      tipo: this.parametro.tipoCuenta == 'DETALLE' ? 'D' : 'G',
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización parametro de la cuenta ` + ' ' + this.parametro.nombre_cuenta + ' ' + `realizado por el Usuario:` + ' ' + this.dataUser.usuario,
      id_controlador: myVarGlobals.fCambioPass,
    };
    this.contableConfSrv.editDataParametro(data).subscribe(res => {
      this.toastr.success(res["message"]);
      location.reload();
    }, (error) => {
      this.toastr.info(error.error.message);
    });
  }

  async validateUdate() {
    if (this.permisions.modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para Actualizar los Parametros Contables");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave("Seguro desea Actualizar Registro?", "MOD_CUENTA");
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.parametro.Codigo == undefined) {
        this.toastr.info("Seleccione Cuenta");
        let autFocus = document.getElementById("idCuenta").focus();
      } else if (this.parametro.id_cuenta == undefined)  {
        this.toastr.info("Seleccione Cuenta Diferente para actualizar parámetro");
        let autFocus = document.getElementById("idCuenta").focus();
      }  else {
        resolve(true);
      }
    });
  }

  limpiarDatos() {
    this.parametro.Codigo = undefined;
    this.parametro.NombreCuentaOficial = undefined;
    this.parametro.tipoCuenta = undefined;
    this.parametro.id = undefined;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
  }

  showCuenta() {
    const dialogRef = this.confirmationDialogService.openDialogMat(ParametroCuentaComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

}


