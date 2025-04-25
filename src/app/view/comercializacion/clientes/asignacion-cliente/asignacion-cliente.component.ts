import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as myVarGlobals from "../../../../global";
import { AsignacionClienteService } from "./asignacion-cliente.services";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import "sweetalert2/src/sweetalert2.scss";
const Swal = require("sweetalert2");
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
@Component({
	selector: "app-asignacion-cliente",
	templateUrl: "./asignacion-cliente.component.html",
	styleUrls: ["./asignacion-cliente.component.scss"],
})
export class AsignacionClienteComponent implements OnInit {
	mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
	processing: any = false;
	dataUser: any;
	permisions: any;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	vendedores: Array < any > = [];
	clientes: Array < any > = [];
	search: Array < any > = [];
	id_usuario: any;
	perfil: any;
	vendedor: any = 0;
	cliente: any = 0;
	validaDt: any = false;
	totalRegistro: any = 0;
	asigVendedor: any;
	cambioAplicados: any = 0;
	asigUser: any;
	asigNombre: any;
	saveData: Array < any > = [];
	vendedorTabla: any;
	empresaData: any;
	idAsesor: any;
	cont: any = 0;
	vmButtons: any = [];
	arrayAsesor:any;
	constructor(
		private toastr: ToastrService,
		private router: Router,
		private asignacionSrv: AsignacionClienteService,
		private commonServices: CommonService,
		private modalService: NgbModal,
		private commonVarSrv: CommonVarService
	) {}

	ngOnInit(): void {
		this.vmButtons = [{
				orig: "btnsAsigEjecutivo",
				paramAccion: "",
				boton: {
					icon: "fas fa-search",
					texto: "BUSCAR"
				},
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				clase: "btn btn-primary boton btn-sm",
				habilitar: false,
				imprimir: false
			},
			{
				orig: "btnsAsigEjecutivo",
				paramAccion: "",
				boton: {
					icon: "fa fa-eraser",
					texto: "CANCELAR"
				},
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				clase: "btn btn-danger boton btn-sm",
				habilitar: false,
				imprimir: false
			},
/* 			{
				orig: "btnsAsigEjecutivo",
				paramAccion: "",
				boton: {
					icon: "far fa-save",
					texto: "GUARDAR"
				},
				permiso: true,
				showtxt: true,{{{{[]}}}}
				showimg: true,
				showbadge: false,
				clase: "btn btn-success boton btn-sm",
				habilitar: false,
				imprimir: false
			}, */
		];

		setTimeout(() => {
			this.permissions();
		}, 10);
	}

	permissions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
		this.id_usuario = this.dataUser.id_usuario;
		this.perfil = this.dataUser.perfil;
		let data = {
			codigo: myVarGlobals.fAsignacionVendedor,
			id_rol: this.dataUser.id_rol,
		};
		this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
			this.permisions = res["data"];
			if (this.permisions[0].ver == "0") {
				this.toastr.info("Usuario no tiene permiso para ver la Asignación de clientes");
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
			} else {
				setTimeout(() => {
					this.getVendedores();
				}, 1000);
			}
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "BUSCAR":
				this.getSearch();
				break;
			case "CANCELAR":
				this.cleanAsignacion();
				break;
/* 			case "GUARDAR":
				this.validaSaveAsignacion();
				break; */
		}
	}

	getVendedores() {
		this.asignacionSrv.getVendedor().subscribe((res) => {
			this.lcargando.ctlSpinner(false);
			this.vendedores = res["data"];
			this.getClient();
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	getClient() {
		let data = {
			id_usuario: this.id_usuario,
			perfil: this.perfil,
		};
		this.asignacionSrv.getClientes(data).subscribe((res) => {
			this.lcargando.ctlSpinner(false);
			this.clientes = res["data"];
		},error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	getSearch() {
		this.lcargando.ctlSpinner(true);
		if (this.vendedor == 0 && this.cliente == 0) {
			this.toastr.info("seleccione cliente o vendedor");
			this.lcargando.ctlSpinner(false);
		} else {
			let data = {
				id_asesor: this.vendedor == 0 ? null : this.vendedor,
				id_cliente: this.cliente == 0 ? null : this.cliente,
			};
			this.asignacionSrv.geSeachAsignacion(data).subscribe((res) => {
				this.search = res["data"];
				this.cambioAplicados = 0;
				if (this.search.length == 0) {
					this.lcargando.ctlSpinner(false);
				} else {
					this.lcargando.ctlSpinner(false);
			
					for (let i = 0; i < this.search.length; i++) {
						this.idAsesor = this.search[i]["fk_asesor"];
						this.totalRegistro = this.search.length;
						this.search[i]["id_usuario"] = this.idAsesor;
					}
				}
			});
		}
	}

	searchVendedor(event) {
		if (this.vendedor == 0) {
			this.search = [];
			this.totalRegistro = "";
			this.cambioAplicados = "";
		} else {
			this.vendedor = event;
		}
	}

	searchCliente(event) {
		if (this.cliente == 0) {
			this.search = [];
			this.totalRegistro = "";
			this.cambioAplicados = "";
		} else {
			this.cliente = event;
		}
	}

	closeData() {
		this.vendedor = 0;
		this.cliente = 0;
		this.search = [];
		this.totalRegistro = "";
		this.cambioAplicados = "";
	}

	setEnvio(dt, index) {
		this.lcargando.ctlSpinner(true);
		if (this.vendedor == 0 && this.cliente == 0) {
			this.lcargando.ctlSpinner(false);
			this.toastr.info("seleccione cliente o vendedor");
		} else {
			this.lcargando.ctlSpinner(false);
			this.asigVendedor = dt;
			this.asigUser = this.asigVendedor.id_usuario;
			this.asigNombre = this.asigVendedor.nombre;
			for (let i = 0; i < this.search.length; i++) {
				this.cambioAplicados = this.search.length;
				this.search[i]["id_usuario"] = this.asigUser;
				this.search[i]["nombre"] = this.asigNombre;
				this.search[i]["usuario"] = this.asigVendedor.usuario;
				this.search[i]["fk_asesor"] = this.asigVendedor.id_usuario;
			}
		}
	}


 	cleanAsignacion() {
		this.vendedor = 0;
		this.cliente = 0; 
		/* this.validaDt = undefined; */
	 	this.search = [];
		this.totalRegistro = 0;
		this.cambioAplicados = 0;
	}
/*
	async validaSaveAsignacion() {
		if (this.permisions[0].editar == "0") {
			this.toastr.info("Usuario no tiene permiso para actualizar Información");
		} else {
			let resp = await this.validateDataGlobal().then((respuesta) => {
				if (respuesta) {
					this.confirmSave(
						"Seguro desea actualizar Registro?",
						"EDIT_ASIGNACION"
					);
				}
			});
		}
	}

	validateDataGlobal() {
		let flag = false;
		return new Promise((resolve, reject) => {
			if (this.vendedor == 0 && this.cliente == 0) {
				this.toastr.info("seleccione cliente o vendedor");
			} else if (this.search.length == 0) {
				this.toastr.info("seleccione datos para buscar");
			} else {
				resolve(true);
			}
		});
	} */

	//SAVE, EDIT, DELETE.
	/* async confirmSave(message, action, prest ? : any) {
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
				if (action == "EDIT_ASIGNACION") {
					this.SaveAsignacion();
				}
			}
		});
	} */

	/*SaveAsignacion() {
		let data = {
			id_cliente: this.search[0].id_cliente,
			fk_asesor: this.search[0].fk_asesor,
			id_asesorAnterior: this.idAsesor,
			dos: this.search,
			ip: this.commonServices.getIpAddress(),
			accion: `Actualizacion de Asesor `,
			id_controlador: myVarGlobals.fAsignacionVendedor,
		};
		this.asignacionSrv.saveAsigancion(data).subscribe(
			(res) => {
				console.log(res);
				this.toastr.success(res["message"]);
				setTimeout(() => {
					this.cleanAsignacion();
					 location.reload(); 
				}, 50);
			},
			(error) => {
				this.toastr.info(error.error.message);
			}
		);
	}*/


	getNameBank(data) {
		this.idAsesor = data;
	}

	SaveAsignacion(dt) {
		dt.fk_asesor = this.idAsesor;
	let data = {
		id_clienteSearch: this.search[0].id_cliente,
		fk_asesorSearch: this.search[0].fk_asesor,
		fk_asesor: dt.fk_asesor,
		id_cliente: dt.id_cliente,
		/* dos: dt, */
		ip: this.commonServices.getIpAddress(),
		accion: `Actualizacion de Asesor `,
		id_controlador: myVarGlobals.fAsignacionVendedor,
	};
	this.asignacionSrv.saveAsigancion(data).subscribe(
		(res) => {
			this.toastr.success(res["message"]);
			this.cont = this.cont + 1;
			for (let i = 0; i < this.search.length; i++) {
				this.cambioAplicados = this.cont;
			}
		},
		(error) => {
			this.toastr.info(error.error.message);
		}
	);
	}
	
}
