import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { DataTableDirective } from "angular-datatables";
import { prestamosService } from "./prestamos.service";
import { CommonVarService } from "../../../../services/common-var.services";
import { CommonService } from "../../../../services/commonServices";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as moment from "moment";
import { PersonalComponent } from "./personal/personal.component";
import { ViewComponent } from './view/view.component';
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { ImprimirPrestamoComponent } from "./imprimir/imprimir.component";
declare const $: any;

@Component({
standalone: false,
	selector: "app-prestamos",
	templateUrl: "./prestamos.component.html",
	styleUrls: ["./prestamos.component.scss"],
})
export class PrestamosComponent implements OnInit {
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	processing: boolean = false;
	permisions: any;
	dataUser: any;
	validaDtUser: any = false;
	estadoDisabled: any = false;
	guardarolT: any = [];
	toDatePicker: Date = new Date();
	current_time: Date = new Date();
	processingtwo: boolean = false;
	actions: any = {
		dComponet: false, //inputs
		btnNuevo: false,
		btnGuardar: false,
		btncancelar: false,
		btneditar: false,
		btneliminar: false,
	};
	flag: number = 0;
	catalog: any = {};
	prestamos: any = {
		monto: 0,
		fecha: this.toDatePicker,
		cuotas: 0,
		porcentaje: 0,
		intereses: 0,
		saldo: 0,
		abono: 0,
		totalMonto: 0,
		lgFormaPago: "",
		tipoPago: "Quincenal"
	};
	dataCuenta: any;
	id_personal: any;
	showCalculo: any = false;
	dtcuotas: any = [];
	arrayDatosChange: any = [];
	arrayListCuotas: any = [];
	date: any;
	lettermes: any;
	fechaPago: any;
	arrayDetalle: Array < any > = [];
	dataModaldescription: any;
	prestamoDato: any;
	id_prestamo: any;
	fechPrueba: Date = new Date(
		this.toDatePicker.getFullYear(),
		this.toDatePicker.getMonth(),
		1
	);
	arrayStatus: Array < any > = [{
			estado: "Pendiente"
		},
		{
			estado: "Atrasado"
		},
		{
			estado: "Pagado"
		},
		{
			estado: "Vencido"
		},
	];
	constructor(
		private prestamosSrvc: prestamosService,
		private toastr: ToastrService,
		private router: Router,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrvice: CommonVarService,
	) {
		this.commonVarSrvice.dataPersonal.asObservable().subscribe((res) => {
			this.id_personal = res.id_personal;
			this.prestamos.nombre = res.nombres;
			this.prestamos.apellido = res.apellidos;
			this.prestamos.documento = res.numdoc;
		});
	}

	isCollapsed1: boolean = false;
	isCollapsed2: boolean = false;
	isCollapsed3: boolean = false;
	isCollapsed4: boolean = false;
	vmButtons: any = [];
	validaciones: ValidacionesFactory = new ValidacionesFactory();

	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

	ngOnInit(): void {

		this.vmButtons = [
			{ orig: "btnPresRol", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnPresRol", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true, imprimir: false},
			// { orig: "btnPresRol", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnPresRol", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},

			{ orig: "btnAnlPres", paramAccion: "", boton: { icon: "fa fa-check-square-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnAnlPres", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false}
		];

		setTimeout(() => {
			this.lcargando.ctlSpinner(true);
		}, 10);
		this.prestamos.tipo = "PRESTAMOS A EMPLEADOS";
		this.permissions();

	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "NUEVO":
				this.newPrestamo();
			break;
			case "GUARDAR":
				this.validaSavePrestamo();
			break;
			case "MODIFICAR":
				this.validaModPrestamo();
			break;
			case "CANCELAR":
				this.cleanPrestamos();
			break;

			case "ANULAR":
				this.deleteSolicitud();
			break;
			case "CERRAR":
				this.closeModal();
			break;
		}
	}

	arrayBanks: any = [];
	getInfoBank() {
		this.prestamosSrvc.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
			this.arrayBanks = res["data"];
			this.obtenerCajaChica();
		}, (error) => {
			this.lcargando.ctlSpinner(false);
		});
	}

	lstCajaChica:any = [];
	obtenerCajaChica(){
		this.prestamosSrvc.getBoxSmallXUsuario().subscribe((datos:any)=>{
			this.lstCajaChica = datos.data;
			this.fillCatalog();
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	/* Api permisos */

	permissions() {
		this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
		let data = {
			codigo: myVarGlobals.fPrestamos,
			id_rol: this.dataUser.id_rol,
		};
		this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
			this.permisions = res["data"];
			if (this.permisions[0].ver == "0") {
				this.lcargando.ctlSpinner(false);
				this.vmButtons = [];
				this.toastr.info("Usuario no tiene permiso para ver el Formulario Prestamos");
			} else {
				this.processing = true;
				this.getInfoBank();
			}
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	newPrestamo() {
		this.actions.btnGuardar = true;
		this.actions.btncancelar = true;
		this.actions.dComponet = true;
		this.actions.btneliminar = true;

		this.vmButtons[0].habilitar = false;
		this.vmButtons[1].habilitar = false;
		// this.vmButtons[2].habilitar = true;
		// this.vmButtons[3].habilitar = false;
	}

	cleanPrestamos() {
		this.resetCalculo();
		this.prestamos.nombre = undefined;
		this.prestamos.apellido = undefined;
		this.prestamos.documento = undefined;
		this.prestamos.descripcion = undefined;
		this.prestamos.lgFormaPago = "";
		this.prestamos.lgCuenta = "";
		this.prestamos.lgNumCheque = "";



		this.actions.btnGuardar = false;
		this.actions.dComponet = false;
		this.actions.btneditar = false;
		this.actions.btneliminar = true;
		this.actions.btnNuevo = false;

		this.vmButtons[0].habilitar = false;
		this.vmButtons[1].habilitar = true;
		// this.vmButtons[2].habilitar = true;
		// this.vmButtons[3].habilitar = true;
	}

	resetEmpleado() {
		this.prestamos.nombre = undefined;
		this.prestamos.apellido = undefined;
		this.prestamos.documento = undefined;
	}

	fillCatalog() {
		let data = {
			params: "'TIPO PAGO PRESTAMO'",
		};
		this.prestamosSrvc.getCatalogs(data).subscribe((res) => {
			this.getSucursal();
			this.catalog.pagoPrestamo = res["data"]["TIPO PAGO PRESTAMO"];
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	dataSucursal: any = [];
	getSucursal() {
		this.prestamosSrvc.getSucursales().subscribe((res) => {
		this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
		this.getDataTable();
		}, (error) => {
			this.lcargando.ctlSpinner(false);
		});
	}

	searchCuenta() {
		const modalInvoice = this.modalService.open(PersonalComponent, {
			size: "lg",
			backdrop: "static",
			windowClass: "viewer-content-general",
		});
	}

	calcularDatos() {
		this.estadoDisabled = false;
		if (this.prestamos.tipoPago == undefined) {
			this.toastr.info("Seleccionee el Tipo de pago");
		} else if (this.prestamos.cuotas == 0) {
			this.toastr.info("Ingrese número de cuotas diferente de cero");
		} else if (this.prestamos.monto == 0) {
			this.toastr.info(
				"Valor monto total es cero , Ingrese valores correspondientes para realizar el calulo"
			);
		} else {
			// ( < HTMLInputElement > document.getElementById("IdAbono")).disabled = true;
			// ( < HTMLInputElement > document.getElementById("IdSaldo")).disabled = true;
			this.showCalculo = true;
			let balance = [this.prestamos.monto, this.prestamos.porcentaje].reduce(
				(a, b) => {
					return a * (b / 100);
				}
			);

			this.prestamos.saldo = this.prestamos.monto;
			this.prestamos.intereses = parseFloat(balance).toFixed(2);
			let monto = parseFloat(this.prestamos.monto);
			let interes = parseFloat(balance);

			let totalm = monto + interes;
			this.prestamos.totalMonto = totalm;

			let totalc = totalm / this.prestamos.cuotas;
			this.prestamos.cuotasXpagar = totalc.toFixed(2);
			let dataFecha = this.prestamos.fecha;
			for (let num = 0; num < this.prestamos.cuotas; num++) {
				if (this.prestamos.tipoPago == "Semanal") {

					this.date = moment(this.prestamos.fecha).add(7, "days");
					this.prestamos.fecha = this.date;

				} else if (this.prestamos.tipoPago == "Quincenal") {

					this.date = moment(this.prestamos.fecha).add(15, "days");
					this.prestamos.fecha = this.date;
				} else if (this.prestamos.tipoPago == "Mensual") {
					this.date = moment(this.prestamos.fecha).add(1, "months");
					this.prestamos.fecha = this.date;

				}
				this.semanalNum(this.date);
				let dtparsing = {
					num_cuota: num + 1,
					fecha_vencimiento: this.date.format("YYYY-MM-DD"),
					monto: parseFloat(this.prestamos.cuotasXpagar),
					letra_mes: this.lettermes,
					estado: "Pendiente"
					/* data: this.prestamos */
				};
				this.dtcuotas = [];

				setTimeout(() => {
					this.dtcuotas.push(dtparsing);
					this.prestamos.fecha = dataFecha;
				}, 100);
			}
		}
	}

	resetCalculo() {
		this.prestamos.monto = 0;
		this.prestamos.cuotas = 0;
		this.prestamos.saldo = 0;
		this.prestamos.abono = 0;
		this.prestamos.porcentaje = 0;
		this.prestamos.intereses = 0;
		this.prestamos.totalMonto = 0;
		this.prestamos.cuotasXpagar = 0;
		this.showCalculo = false;
		this.prestamos.tipoPago = "Quincenal";
		this.prestamos.fecha = this.toDatePicker;
		this.dtcuotas = undefined;
	}


	async validaSavePrestamo() {
		if (this.permisions[0].ver == "0") {
			this.toastr.info("Usuario no tiene permiso para guardar");
		} else {
			let resp = await this.validateDataGlobal().then((respuesta) => {
				if (respuesta) {
					this.confirmSave("Seguro desea guardar Registro?", "SAVE_PRESTAMO");
				}
			});
		}
	}

	validateDataGlobal() {

		let flag = false;
		return new Promise((resolve, reject) => {
			if (this.prestamos.tipoPago == undefined) {
				this.toastr.info("Seleccione Tipo Pago !!");
				let autFocus = document.getElementById("IdTipoPago").focus();
			} else if (this.prestamos.monto == 0) {
				this.toastr.info("Ingrese valor Monto");
				let autFocus = document.getElementById("IdMonto").focus();
			} else if (this.prestamos.cuotas == undefined) {
				this.toastr.info("Ingrese valor diferente a cero");
				let autFocus = document.getElementById("IdCuotas").focus();
			} else if (this.prestamos.totalMonto == 0) {
				this.toastr.info("Ingrese valores para realizar el Calculo");
			} else if (this.prestamos.monto != this.prestamos.saldo) {
				this.toastr.info("El valor Monto debe ser igual saldo");
				let autFocus = document.getElementById("IdSaldo").focus();
			} else if (this.prestamos.nombre == undefined) {
				this.toastr.info("Buscar al empleado");
				let autFocus = document.getElementById("Idnombre").focus();
			} else if (this.prestamos.apellido == undefined) {
				this.toastr.info("Buscar al empleado");
				let autFocus = document.getElementById("Idapellido").focus();
			} else if (this.prestamos.documento == undefined) {
				this.toastr.info("Buscar al empleado");
				let autFocus = document.getElementById("Iddocumento").focus();
			} else if (this.dtcuotas == undefined) {
				this.toastr.info("Realize Calculo respectivo del prestamo en cuotas");
			} else if (this.validaciones.verSiEsNull(this.prestamos.lgFormaPago) == undefined) {
				this.toastr.info("Por favor seleccionar formar de pago");
			} else if (this.validaciones.verSiEsNull(this.prestamos.lgCuenta) == undefined) {
				this.toastr.info("Por favor seleccionar una cuenta");
			} else if (this.validaciones.verSiEsNull(this.prestamos.lgNumCheque) == undefined) {
				this.toastr.info("Por favor " + this.prestamos.lgFormaPago == 'T'?'Ingresar Numero de Transaccion':'Ingresar Numero de cheque');
			} else {
				resolve(true);
			}

		});
	}

	SavePrestamos() {
		let data = {
			tipo: "PAE",
			id_empleado: this.id_personal,
			monto: this.prestamos.monto,
			monto_total: this.prestamos.totalMonto,
			tipo_pago: this.prestamos.tipoPago,
			cuotas: parseFloat(this.prestamos.cuotas),
			abono: parseFloat(this.prestamos.abono),
			saldo: parseFloat(this.prestamos.saldo),
			cuotas_paga: parseFloat(this.prestamos.cuotasXpagar),
			interes: parseFloat(this.prestamos.intereses),
			porcentaje: parseFloat(this.prestamos.porcentaje),
			fecha_inicio: moment(this.prestamos.fecha).format("YYYY-MM-DD"),
			detalle: this.prestamos.descripcion == undefined ? null : this.prestamos.descripcion,
			dt_prestamos: this.dtcuotas,
			ip: this.commonServices.getIpAddress(),
			accion: `Registro nuevo prestamos ${this.prestamos.nombre} `,
			id_controlador: myVarGlobals.fPrestamos,
			nombreEmpleado: this.prestamos.nombre,
			datos: this.prestamos
		};
		console.log("data: ", data)
		(this as any).mensajeSpinner = "Guardando...";
		this.lcargando.ctlSpinner(true);
		this.prestamosSrvc.savePrestamos(data).subscribe((res) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.success(res["message"]);
			this.cleanPrestamos();
			this.dtElement.dtInstance.then((dtInstance: any) => {
				dtInstance.destroy();
				this.getDataTable();
				this.imprimirAsiento(res["data"]);
			});
		},(error) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}


	async validaModPrestamo() {
		if (this.permisions[0].editar == "0") {
			this.toastr.info("Usuario no tiene permiso para guardar");
		} else {
			let resp = await this.validateDataGlobal().then((respuesta) => {
				if (respuesta) {
					this.confirmSave("Seguro desea modificar Registro?", "MOD_PRESTAMOS");
				}
			});
		}
	}


	getDataTable() {
		this.dtOptions = {
			pagingType: "full_numbers",
			pageLength: 3,
			search: true,
			order: [[ 0, "desc" ]],
			paging: true,
			language: {
				url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
			},
		};
		(this as any).mensajeSpinner = "Cargando...";
		this.lcargando.ctlSpinner(true);
		this.prestamosSrvc.tablaPrestamo().subscribe((res) => {
			this.processing = true;
			this.validaDtUser = true;
			this.guardarolT = res["data"];
			this.getDetalle();
			setTimeout(() => {
				this.dtTrigger.next(null);
			}, 50);
		}, (error) => {
			this.lcargando.ctlSpinner(false);
			this.dtTrigger.next(null);
			this.processing = true;
		});
	}

	getDetalle() {
		this.prestamosSrvc.tablaPrestamoDt().subscribe((res) => {
			this.lcargando.ctlSpinner(false);
			this.arrayDetalle = res["data"];
			this.prestamosSrvc.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
				this.arrayBanks = res["data"];
			}, (error) => {
				this.lcargando.ctlSpinner(false);
			});
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	deletePrestamo(dt, i) {
		this.prestamoDato = dt;
		$('#PrestamosModal').appendTo("body").modal('show');
	}

	deleteSolicitud() {
		let empleado = this.prestamoDato.nombres + this.prestamoDato.apellidos;
		if (this.permisions.eliminar == "0") {
			this.toastr.info("Usuario no tiene permiso para anular la Solicitud");
		} else {
			if (this.dataModaldescription == "" || this.dataModaldescription == undefined) {
				document.getElementById('Idcausa').focus();
				this.toastr.info("Ingrese un motivo de anulación del Prestamo");
			} else {
				this.confirmSave('Seguro desea anular el Prestamo' + ' ' + 'del Empleado' + ' ' + empleado + ' ' + '?', "DELETE_PRESTAMO", this.prestamoDato);
			}
		}
	}

	destroyPrestamo(dt) {

		let data = {
			id_prestamo: dt.id_prestamo,
			anulado_causa: this.dataModaldescription,
			id_controlador: myVarGlobals.fPrestamos,
			accion: `Borrado el prestamo del empleado ${this.prestamoDato.nombres + this.prestamoDato.apellidos}`,
			ip: this.commonServices.getIpAddress(),
		};
		(this as any).mensajeSpinner = "Guardando...";
		this.lcargando.ctlSpinner(true);
		this.prestamosSrvc.deletePrestamo(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.toastr.success(res["message"]);
			this.cleanPrestamos();
			this.dtElement.dtInstance.then((dtInstance: any) => {
				dtInstance.destroy();
				this.getDataTable();
			});
		}, (error) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}

	closeModal() {
		this.dataModaldescription = "";
		($("#PrestamosModal") as any).modal(
			"hide"
		);
	}

	//SAVE, EDIT, DELETE.
	async confirmSave(message, action, prest ? : any) {
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
				if (action == "SAVE_PRESTAMO") {
					this.SavePrestamos();
				} else if (action == "DELETE_PRESTAMO") {
					($('#PrestamosModal') as any).modal('hide');
					this.destroyPrestamo(prest);
				} else if (action == "MOD_PRESTAMOS") {
					this.EditPrestamos();
				}
			}
		});
	}

	informaciondtPrestamo(dt) {

		if (this.permisions[0].consultar == "0") {
			this.toastr.info("Usuario no tiene Permiso para consultar");
		} else {
			const modalInvoice = this.modalService.open(ViewComponent, {
				size: "xl",
				backdrop: 'static',
				windowClass: 'viewer-content-general'
			});
			modalInvoice.componentInstance.dt = dt;
			modalInvoice.componentInstance.data = {
				permisoDown: this.permisions[0].descargar
			};
		}
	}


	editPrestamo(dt, i) {
		console.log("editPrestamo: ", dt)
		this.actions.dComponet = true;
		this.actions.btnNuevo = true;
		this.actions.btnGuardar = false;
		this.actions.btneditar = true;
		this.actions.btncancelar = true;
		this.actions.btneliminar = true;
		this.id_prestamo = dt.id_prestamo;
		this.id_personal = dt.id_empleado;
		this.prestamos.tipoPago = dt.tipo_pago;
		this.prestamos.fecha = dt.fecha_inicio;
		this.prestamos.nombre = dt.nombres;
		this.prestamos.apellido = dt.apellidos;
		this.prestamos.documento = dt.numdoc;
		this.prestamos.monto = parseFloat(dt.monto).toFixed(0);
		this.prestamos.cuotas = dt.cuotas;
		this.prestamos.porcentaje = parseFloat(dt.porcentaje).toFixed(0);
		this.prestamos.totalMonto = parseFloat(dt.monto_total).toFixed(0);
		this.prestamos.intereses = parseFloat(dt.interes).toFixed(2);
		this.prestamos.abono = parseFloat(dt.abono).toFixed(0);
		this.prestamos.saldo = parseFloat(dt.saldo).toFixed(0);
		this.prestamos.cuotasXpagar = parseFloat(dt.cuotas_paga).toFixed(2);
		this.prestamos.descripcion = dt.detalle;

		let cuenta:any = this.arrayBanks.find(datos=>datos.id_banks == dt.fk_id_cuenta);
		console.log("cuenta: ", cuenta)
		this.prestamos.lgCuenta =  cuenta;
		this.prestamos.lgFormaPago = dt.forma_pago;
		this.prestamos.lgNumCheque = dt.num_transaccion;

		this.showCalculo = true;
		let filt = this.arrayDetalle.filter((e) => e.id_prestamos == dt.id_prestamo);
		this.dtcuotas = filt;
		this.estadoDisabled = true;
		this.fechaEstado();

		this.vmButtons[0].habilitar = true;
		this.vmButtons[1].habilitar = true;
		// this.vmButtons[2].habilitar = false;
		// this.vmButtons[3].habilitar = false;

	}

	fechaEstado() {
		for (let i = 0; i < this.dtcuotas.length; i++) {
			this.dtcuotas[i]["fecha_vencimiento"];
			let fechaActual = moment(this.toDatePicker).format("YYYY-MM-DD")
			if (fechaActual > this.dtcuotas[i]["fecha_vencimiento"] && this.dtcuotas[i]["estado"] != 'Pagado') {
				this.dtcuotas[i]["estado"] = 'Vencido';
			} else if (fechaActual < this.dtcuotas[i]["fecha_vencimiento"]) {
				this.dtcuotas[i]["estado"] = 'Pendiente';
			}
		}
	}

	setfecha() {
		for (let i = 0; i < this.dtcuotas.length; i++) {
			this.date = this.dtcuotas[i]["fecha_vencimiento"];
			this.semanalNum(this.date);
			let pasaData = this.lettermes;
			this.dtcuotas[i]["letra_mes"] = pasaData;
			this.lettermes = this.dtcuotas[i]["letra_mes"];
		}
	}

	//Semana del mes
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
		this.lettermes = weekNum;

	}

	EditPrestamos() {
		let data = {
			id_prestamo: this.id_prestamo,
			tipo: "PAE",
			id_empleado: this.id_personal,
			monto: this.prestamos.monto,
			monto_total: this.prestamos.totalMonto,
			tipo_pago: this.prestamos.tipoPago,
			cuotas: parseFloat(this.prestamos.cuotas),
			abono: parseFloat(this.prestamos.abono),
			saldo: parseFloat(this.prestamos.saldo),
			cuotas_paga: parseFloat(this.prestamos.cuotasXpagar),
			interes: parseFloat(this.prestamos.intereses),
			porcentaje: parseFloat(this.prestamos.porcentaje),
			fecha_inicio: moment(this.prestamos.fecha).format("YYYY-MM-DD"),
			detalle: this.prestamos.descripcion == undefined ? null : this.prestamos.descripcion,
			dt_prestamos: this.dtcuotas,
			ip: this.commonServices.getIpAddress(),
			accion: `Modificación del prestamo #${this.id_prestamo} del empleado ${this.prestamos.nombre}  `,
			id_controlador: myVarGlobals.fPrestamos,
		};
		(this as any).mensajeSpinner = "Modificando...";
		this.lcargando.ctlSpinner(true);
		this.prestamosSrvc.editarPrestamo(data).subscribe((res) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.success(res["message"]);
			this.cleanPrestamos();
			this.dtElement.dtInstance.then((dtInstance: any) => {
				dtInstance.destroy();
				this.getDataTable();
			});
		}, (error) => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}

	limpiarCtaTran(){
		this.prestamos.lgCuenta = "";
		this.prestamos.lgNumCheque = "";
	}

	cambioTipoCta(){
		if(this.prestamos.lgFormaPago == 'C'){
			return {field:'tipo_cuenta', value: 'Corriente'};
		}
		return {field:'tipo_cuenta', value: ''};
	}


	@ViewChild (ImprimirPrestamoComponent,{static:false}) imprimirPrestamoComponent:ImprimirPrestamoComponent;
	imprimirAsiento(datos:any){
		console.log("imprimirAsiento: ", datos)
		this.lcargando.ctlSpinner(true);
		this.prestamosSrvc.getAsientoDiario({datos: datos}).subscribe((datosAsi:any)=>{

			this.imprimirPrestamoComponent.setearValores(datosAsi.data[0], this.dataUser, this.dataSucursal, datos);

			setTimeout(() => {
				this.lcargando.ctlSpinner(false);
				let element: HTMLElement = document.getElementsByClassName("imprimirDatos")[0] as HTMLElement;
				element.click();
			}, 100);

		}, error=>{
			this.lcargando.ctlSpinner(false);
		})
	}

}
