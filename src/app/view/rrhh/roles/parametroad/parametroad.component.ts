import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { ParametroadService } from "./parametroad.service";
import { CommonVarService } from "../../../../services/common-var.services";
import { CommonService } from "../../../../services/commonServices";
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
const Swal = require('sweetalert2');
declare const $: any;
@Component({
standalone: false,
  selector: "app-parametroad",
  templateUrl: "./parametroad.component.html",
  styleUrls: ["./parametroad.component.scss"],
})
export class ParametroadComponent implements OnInit {
  /* Datatable options */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  //dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  processing: boolean = false;
  processingtwo: boolean = false;
  permisions: any;
  dataUser: any;
  validaDtUser: any = false;
  guardaT: any = [];

  dataCuenta: any;
  cuentaNmbre: any;
  cuenta: any;
  Discuentas: false;
  idCuenta: any;
  id_parametro: any;
  codigoCuenta: any;
  //cuentaNombre: any;
  cuentaIDupdate: any;

  actions: any = {
    dComponet: false, //inputs
    btnNuevo: false,
    btnGuardar: false,
    btncancelar: false,
    btneditar: false,
    btneliminar: false,
  };

  descuentoData: any;
  sueldData: any;
  idTabla: any;
  idInput: any;
  valorupdate: any = true;
  /*inputs*/
  parameters: any = { IngresoValor: 0, sueldoUnificado: 0, cantidadMulta: 0, tipoFormula: "N"};

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private parametroAdminidtracionSrv: ParametroadService,
    private commonVarSrvice: CommonVarService
  ) {
    this.commonVarSrvice.setCuentaData.asObservable().subscribe((res) => {
      this.cuenta = res;
      this.parameters.IngresoCuenta = res.nombre;
      this.idCuenta = res.id;
      this.codigoCuenta = res.codigo;
      this.closeModal();
    });
  }

  vmButtons: any = [];
	mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory();

	ngOnInit(): void {

		this.vmButtons = [
			{ orig: "btnParNom", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnParNom", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnParNom", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true, imprimir: false},
      { orig: "btnParNom", paramAccion: "1", boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-eliminar boton btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnParNom", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: false},

      { orig: "btnParNomCta", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
    ];

		setTimeout(() => {
			this.lcargando.ctlSpinner(true);
		}, 10);
    this.getNomina();
    this.permissions();
  }

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto+evento.items.paramAccion) {
			case "NUEVO1":
				this.newparameter();
			break;
			case "GUARDAR1":
				this.validaSaveparameter();
			break;
			case "MODIFICAR1":
				this.validaUpdateparameter();
			break;
			case "CANCELAR1":
				this.cleanparameter();
			break;
			case "ELIMINAR1":
				this.delete();
			break;

      case "CERRAR2":
				this.closeModal();
			break;
		}
	}

  /* Api permisos */
  permissions() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fAdmiParametros,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.permisions = res["data"];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver el Formulario Parametros Administración");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
          this.processing = true;
          this.showDataTableParametros();
      }
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getNomina() {
    let data = {
      id: 1,
    };
    this.dataCuenta = data;
  }

  showDataTableParametros() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.parametroAdminidtracionSrv.presentaTablaParametros().subscribe((res) => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.validaDtUser = true;
      this.guardaT = res["data"];
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.ngOnDestroy();
      }, 50);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ValorPorcentaje() {
    // (<HTMLInputElement>document.getElementById("idmulta")).disabled = true;
  }
  newparameter() {
    this.cleanparameter();
    this.actions.btnGuardar = true;
    this.actions.btncancelar = true;
    this.actions.dComponet = true;

    this.vmButtons[0].habilitar = false;
		this.vmButtons[1].habilitar = false;
		this.vmButtons[2].habilitar = true;
		this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = false;
  }

  cancelparameter() {
    this.actions.btnNuevo = false;
    this.actions.btnGuardar = false;
    this.actions.dComponet = false;
    this.cleanparameter();
  }

  validaSaveparameter() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar ");
    } else {
      if (this.parameters.Ingresotipo == undefined || this.parameters.Ingresotipo == ""
      ) {
        this.toastr.info("Ingrese Tipo de Parametro!!");
        let autFocus = document.getElementById("IdTipo").focus();
      } else if (this.parameters.IngresoNombre == undefined || this.parameters.IngresoNombre == "") {
        this.toastr.info("Ingrese Nombre del parametro !!");
        let autFocus = document.getElementById("idNombre").focus();
      } /* else if (this.parameters.IngresoValor == undefined || this.parameters.IngresoValor == "") {
          this.toastr.info("Ingrese un Valor !!");
          let autFocus = document.getElementById("IdValor").focus();
        }  */ else if (this.parameters.checkUnificado == true && (this.parameters.sueldoUnificado == undefined || this.parameters.sueldoUnificado == "" || this.parameters.sueldoUnificado == null)
      ) {
        this.toastr.info("Ingrese  valor sueldo unificado !!");
        let autFocus = document.getElementById("idsuelundificado").focus();
      } /* else if (this.parameters.IngresoCuenta == undefined || this.parameters.IngresoCuenta == "") {
          this.toastr.info("Buscar Cuenta !!");
          let autFocus = document.getElementById("idCuenta").focus();
        } */ else if (this.parameters.IngresoDC == undefined || this.parameters.IngresoDC == "") {
        this.toastr.info("Ingrese Debito/Credito !!");
        let autFocus = document.getElementById("idDC").focus();
      } else if (this.parameters.IngresoClase == undefined || this.parameters.IngresoClase == "") {
        this.toastr.info("Ingrese una Clase!!");
        let autFocus = document.getElementById("IdClase").focus();
      } else if (this.parameters.checkMulta == true && (this.parameters.cantidadMulta == undefined || this.parameters.cantidadMulta.toString() == "" || this.parameters.cantidadMulta == null)) {
        this.toastr.info("Ingrese  valor de multa !!");
        let autFocus = document.getElementById("idmulta").focus();
      } else if(this.validaciones.verSiEsNull(this.parameters.formula) == undefined && this.parameters.tipoFormula == "S") {
        this.toastr.info("Ingrese una formula !!");
        let autFocus = document.getElementById("idformula").focus();
      } else{
        this.confirmSave("Seguro desea guardar el registro?", "SAVE_PARAMETERS");
      }
    }
  }

  Saveparameter() {
    let data = {
      tipo: this.parameters.Ingresotipo,
      nombre: this.parameters.IngresoNombre,
      valor: parseFloat(this.parameters.IngresoValor),
      codigo: this.codigoCuenta ? this.codigoCuenta : null,
      cuenta: this.idCuenta ? this.codigoCuenta : null,
      c_d: this.parameters.IngresoDC,
      clase: this.parameters.IngresoClase,
      sueldo: this.parameters.checkUnificado == true ? 1 : 0,
      cantidad_unificado:
        this.parameters.checkUnificado == true
          ? this.parameters.sueldoUnificado
          : 0,
      sueldo_multa: this.parameters.checkMulta == true ? 1 : 0,
      cantidad_multa:
        this.parameters.checkMulta == true ? this.parameters.cantidadMulta : 0,
      ip: this.commonServices.getIpAddress(),
      accion: "Registro guardado de parametros" + this.parameters.IngresoNombre,
      id_controlador: myVarGlobals.fAdmiParametros,
      tipo_calculo: this.parameters.tipoFormula,
      formula: this.parameters.formula
    };
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.parametroAdminidtracionSrv.Saveparameters(data).subscribe((res) => {
      this.toastr.success(res["message"]);
      this.lcargando.ctlSpinner(false);
      this.cleanparameter();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.destroy();
				this.showDataTableParametros();
			});
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  updateParametros(dt) {
    this.processingtwo = true;
    this.actions.btnNuevo = true;
    this.actions.dComponet = true;
    this.actions.btnGuardar = false;
    this.actions.btneditar = true;
    this.actions.btncancelar = true;
    this.actions.btneliminar = true;

    this.vmButtons[0].habilitar = true;
		this.vmButtons[1].habilitar = true;
		this.vmButtons[2].habilitar = false;
		this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = false;

    this.id_parametro = dt.id_parametro;
    this.parameters.IngresoNombre = dt.nombre;
    this.parameters.Ingresotipo = dt.tipo;
    this.parameters.IngresoValor = dt.valor == "0.00" ? Math.floor(dt.valor) : dt.valor;
    this.idCuenta = dt.cuenta ? dt.cuenta : " ";
    this.codigoCuenta = dt.codigo ? dt.codigo : " ";
    this.parameters.IngresoCuenta = dt.nombre_cuenta;
    this.parameters.IngresoDC = dt.c_d;
    this.parameters.IngresoClase = dt.clase;
    this.parameters.checkUnificado = dt.sueldo == "1" ? true : false;
    this.parameters.sueldoUnificado =
      dt.cantidad_unificado == "0.00"
        ? Math.floor(dt.cantidad_unificado)
        : dt.cantidad_unificado;
    this.parameters.checkMulta = dt.sueldo_multa == "1" ? true : false;
    this.parameters.cantidadMulta = dt.valor_cantidad == "0.00" ? Math.floor(dt.valor_cantidad) : dt.valor_cantidad;
    dt.sueldo == "1" ? ((<HTMLInputElement>(document.getElementById("idsuelundificado"))).disabled = false) : ((<HTMLInputElement>(document.getElementById("idsuelundificado"))).disabled = true);
    if (dt.sueldo_multa == "1") {
      // (<HTMLInputElement>document.getElementById("idmulta")).disabled = false;
      // (<HTMLInputElement>document.getElementById("IdValor")).disabled = true;
      this.valorupdate = false;
    } else {
      // (<HTMLInputElement>document.getElementById("idmulta")).disabled = true;
      // (<HTMLInputElement>document.getElementById("IdValor")).disabled = false;
      this.valorupdate = true;
    }
  }

  validaUpdateparameter() {
    if (this.permisions[0].modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      if (
        this.parameters.Ingresotipo == undefined ||
        this.parameters.Ingresotipo == ""
      ) {
        this.toastr.info("Ingrese Tipo de Parametro!!");
        let autFocus = document.getElementById("IdTipo").focus();
      } else if (
        this.parameters.IngresoNombre == undefined ||
        this.parameters.IngresoNombre == ""
      ) {
        this.toastr.info("Ingrese Nombre del parametro !!");
        let autFocus = document.getElementById("idNombre").focus();
      } /*  else if (this.parameters.IngresoValor == undefined || this.parameters.IngresoValor == "") {
        this.toastr.info("Ingrese un Valor !!");
        let autFocus = document.getElementById("IdValor").focus();
      } */ else if (
        this.parameters.checkUnificado == true &&
        (this.parameters.sueldoUnificado == undefined ||
          this.parameters.sueldoUnificado == "")
      ) {
        this.toastr.info("Ingrese  valor sueldo unificado !!");
        let autFocus = document.getElementById("idsuelundificado").focus();
      } else if (
        /*   else if (this.parameters.IngresoCuenta == undefined || this.parameters.IngresoCuenta == "") {
          this.toastr.info("Buscar Cuenta !!");
          let autFocus = document.getElementById("idCuentas").focus();
        } */
        this.parameters.IngresoDC == undefined ||
        this.parameters.IngresoDC == ""
      ) {
        this.toastr.info("Ingrese Debito/Credito !!");
        let autFocus = document.getElementById("idDC").focus();
      } else if (
        this.parameters.IngresoClase == undefined ||
        this.parameters.IngresoClase == ""
      ) {
        this.toastr.info("Ingrese una Clase!!");
        let autFocus = document.getElementById("IdClase").focus();
      } else if (
        this.parameters.checkMulta == true &&
        (this.parameters.cantidadMulta == undefined ||
          this.parameters.cantidadMulta.toString() == "" ||
          this.parameters.cantidadMulta == null)
      ) {
        this.toastr.info("Ingrese  valor de multa !!");
        let autFocus = document.getElementById("idmulta").focus();
      } else {
        this.confirmSave(
          "Seguro desea modificar el registro?",
          "MOD_PARAMETERS"
        );
      }
    }
  }

  modParameter() {
    let data = {
      id_parametro: this.id_parametro,
      tipo: this.parameters.Ingresotipo,
      nombre: this.parameters.IngresoNombre,
      valor: parseFloat(this.parameters.IngresoValor),
      codigo: this.codigoCuenta ? this.codigoCuenta : null,
      cuenta: this.idCuenta ? this.codigoCuenta : null,
      c_d: this.parameters.IngresoDC,
      clase: this.parameters.IngresoClase,
      sueldo: this.parameters.checkUnificado == true ? 1 : 0,
      cantidad_unificado:
        this.parameters.checkUnificado == true
          ? this.parameters.sueldoUnificado
          : 0,
      sueldo_multa: this.parameters.checkMulta == true ? 1 : 0,
      cantidad_multa:
        this.parameters.checkMulta == true ? this.parameters.cantidadMulta : 0,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización del parametro ${this.parameters.IngresoNombre} con el id: ${this.id_parametro} `,
      id_controlador: myVarGlobals.fAdmiParametros,
    };
    this.mensajeSppiner = "Modificando...";
    this.lcargando.ctlSpinner(true);
    this.parametroAdminidtracionSrv.modParameters(data).subscribe((res) => {
      this.toastr.success(res["message"]);
      this.lcargando.ctlSpinner(false);
      this.cleanparameter();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.destroy();
				this.showDataTableParametros();
			});
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  delete() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.confirmSave(
        "Seguro desea eliminar el registro?",
        "DELETE_PARAMETERS"
      );
    }
  }

  deleteParameters() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      id_parametro: this.id_parametro,
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación del parametro ${this.parameters.IngresoNombre} con el id: ${this.id_parametro} `,
      id_controlador: myVarGlobals.fAdmiParametros,
    };
    this.mensajeSppiner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.parametroAdminidtracionSrv.deleteParametersad(data).subscribe((res) => {
      this.toastr.success(res["message"]);
      this.lcargando.ctlSpinner(false);
      this.cleanparameter();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.destroy();
				this.showDataTableParametros();
			});
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  searchCuenta() {
    $('#bd-example-modal-lg').appendTo('body').modal('show');
    this.processingtwo = true;
  }

  closeModal() {
    this.processingtwo = false;
    ($("#bd-example-modal-lg") as any).modal(
      "hide"
    ); /* linea para cerrar el modal de boostrap */
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_PARAMETERS") {
          this.Saveparameter();
        } else if (action == "MOD_PARAMETERS") {
          this.modParameter();
        } else if (action == "DELETE_PARAMETERS") {
          this.deleteParameters();
        }
      }
    });
  }

  cleanparameter() {
    this.parameters.IngresoNombre = "";
    this.parameters.Ingresotipo = "";
    this.parameters.IngresoCuenta = "";
    this.parameters.IngresoValor = 0;
    this.parameters.sueldoUnificado = 0;
    this.parameters.cantidadMulta = 0;
    this.parameters.IngresoDC = "";
    this.parameters.IngresoClase = "";
    this.actions.dComponet = false;
    this.actions.btnGuardar = false;
    this.actions.btnNuevo = false;
    this.actions.btneditar = false;
    this.actions.btneliminar = false;
    this.parameters.checkMulta = false;
    this.parameters.checkUnificado = false;

    this.vmButtons[0].habilitar = false;
		this.vmButtons[1].habilitar = true;
		this.vmButtons[2].habilitar = true;
		this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
  }

  setMulta() {
    if (this.parameters.checkMulta == true) {
      this.descuentoData = true;
      // (<HTMLInputElement>document.getElementById("IdValor")).disabled = true;
      this.parameters.IngresoValor = 0;
    } else {
      this.descuentoData = false;
      this.parameters.cantidadMulta = 0;
      // (<HTMLInputElement>document.getElementById("IdValor")).disabled = false;
    }
  }

  setsueldoUni() {
    if (this.parameters.checkUnificado == true) {
      this.sueldData = true;
    } else {
      this.sueldData = false;
    }
  }
}
