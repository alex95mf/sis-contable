import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import * as myVarGlobals from "../../../../global";
import { ToastrService } from "ngx-toastr";
import { TomaFisicaService } from "./toma-fisica.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
	selector: 'app-toma-fisica',
	templateUrl: './toma-fisica.component.html',
	styleUrls: ['./toma-fisica.component.scss']
})
export class TomaFisicaComponent implements OnInit {
	
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	btnSave: any = false;
	btnEdit: any = false;
	infoFisica: any;
	processing: any = false;
	processingtwo: any = false;
	processingthree: any = false;
	productDisabled: any = false;
	permisions: any;
	dataUser: any;
	toma: any = {
		sucursal: 0,
		bodega: 0,
		grupo: 0
	};
	observacion: any;
	viewDate: Date = new Date();
	arrayBodega: Array < any > = [];
	arraySucursal: Array < any > = [];
	arrayGrupo: Array < any > = [];
	arrayProducto: Array < any > = [];
	arrayFiltProducto: Array <any> = [];
	cuenta: any = {};
	resultdifCos: any;
	cuentas: any;
	num: any = 0;
	idDoc: any = {};
	dataProducto = [{
		productSelect: 0,
		codigo: null,
		costo: 0,
		stock: 0,
		conteo: 0.00,
		diferencia: 0.00,
		movimiento: null,
		valorDiferencia: null
	}];
	totalAsiento: any;
	vmButtons: any = [];

	constructor(private toastr: ToastrService,
		private router: Router,
		private tomafisicaSrv: TomaFisicaService,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService) {
		this.commonVarSrv.setCuentasFisica.asObservable().subscribe(res => {
			this.cuenta.nombreInvenatario = res.nombre;
			this.cuenta.codigoInventario = res.codigo;
			this.cuenta.idCuentaInventario = res.id;
		});
		this.commonVarSrv.setCuentasFisicados.asObservable().subscribe(res => {
			this.cuenta.nombreTomaFisica = res.nombre;
			this.cuenta.codigoTomaFisica = res.codigo;
			this.cuenta.idCuentaTomaFisica = res.id;
		});
	}

	ngOnInit(): void {
		this.vmButtons = [
			{ orig: "btnTomaFisica", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: false},
			{ orig: "btnTomaFisica", paramAccion: "", boton: { icon: "fas fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true, imprimir: false},
		
			{ orig: "btnTomaFisicacone", paramAccion: "", boton: { icon: "fas fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnTomaFisicactwo", paramAccion: "", boton: { icon: "fas fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
		];

		setTimeout(() => {
			    this.lcargando.ctlSpinner(true);
				this.getPermisions();
		}, 10);
	}

	getPermisions() {
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fTomaFisica,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.toastr.info("Usuario no tiene permiso para ver Formulario de Toma Física.");
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
				this.processing = false;
			} else {
				this.processing = true;
				this.getBodega();
				this.fktomaFisica();
				this.getsucursales();
			}
		}, error => {
			this.toastr.info(error.error.message);
		})
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		case "CANCELAR":
			this.canceFisica();
			break;
		case "GUARDAR":
			this.validateSave();
			break;
		case "CERRAR":
		    this.closeModal();
			break;
		case "CERRAR":
		this.closeModalDos();
		     break;
		}
	}

	fktomaFisica() {
		this.tomafisicaSrv.getDocTomaFisica().subscribe(res => {
			this.idDoc = res['data'];
		}, error => {
			this.toastr.info(error.error.message);
		})
	}

	getBodega() {
		this.tomafisicaSrv.getBodegas().subscribe(res => {
			this.toma.bodega = 0;
			this.arrayBodega = res['data'];

		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getsucursales() {
		let data = {
			id_empresa: this.dataUser.id_empresa,
		}
		this.tomafisicaSrv.getSucursal(data).subscribe(res => {
			this.arraySucursal = res['data'];
			this.getGrupos();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getGrupos() {
		this.tomafisicaSrv.getGrupo().subscribe(res => {
			this.arrayGrupo = res['data'];
			this.getProductoArray();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getProductoArray() {
		this.tomafisicaSrv.getProductoFilter().subscribe(res => {
			this.arrayProducto = res['data'];
			this.getProductos(this.toma.sucursal, this.toma.bodega, this.toma.grupo);
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}


	filterSucursal(data) {
		if (this.toma.sucursal != 0) {
			this.vmButtons[0].habilitar = false;
			this.toma.sucursal = data;
			this.toma.bodega = 0;
			this.getProductos(this.toma.sucursal, this.toma.bodega, this.toma.grupo);
		} else {
			this.dataProducto = [{
				productSelect: 0,
				codigo: null,
				costo: 0,
				stock: 0,
				conteo: 0.00,
				diferencia: 0.00,
				movimiento: null,
				valorDiferencia: null
			}];
		}
	}

	filterBodega(data) {
		if (this.toma.bodega != 0) {
			this.toma.bodega = data;
			this.getProductos(this.toma.sucursal, this.toma.bodega, this.toma.grupo);
		} else {
			this.dataProducto = [{
				productSelect: 0,
				codigo: null,
				costo: 0,
				stock: 0,
				conteo: 0.00,
				diferencia: 0.00,
				movimiento: null,
				valorDiferencia: null
			}];
		}
	}

	filterGrupo(data) {
		if (this.toma.grupo != 0) {
			this.toma.grupo = data;
			this.getProductos(this.toma.sucursal, this.toma.bodega, this.toma.grupo);
		} else {
			this.dataProducto = [{
				productSelect: 0,
				codigo: null,
				costo: 0,
				stock: 0,
				conteo: 0.00,
				diferencia: 0.00,
				movimiento: null,
				valorDiferencia: null
			}];
		}
	}

	getProductos(sucursal, bodega, grupo) {
		let data = {
			sucursal: sucursal == 0 ? null : sucursal,
			bodega: bodega == 0 ? null : bodega,
			grupo: grupo == 0 ? null : grupo,
		}
		this.tomafisicaSrv.getFilter(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayFiltProducto = res['data'];
			if ( res['data'].length > 0) {
				this.productDisabled = true;
			} else {
				this.toastr.info("No Existen Productos" );
				this.productDisabled = false;
			}

		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getDataProduct(evt, index) {
		this.productDisabled = true;
		this.vmButtons[1].habilitar = false;
		if (evt != 0) {
			let filt = this.arrayProducto.filter(e => e.id_producto == evt);
			filt = filt[0];
			let validt = false;
			this.dataProducto.forEach(element => {
				if (element.codigo == filt['codigoProducto']) {
					validt = true;
				}
			});
			if (validt) {
				Swal.fire(
					'Atención!',
					'Este producto ya se encuenta en la lista ingresada!',
					'error'
				)
				this.dataProducto[index].productSelect = 0;
				this.dataProducto[index].codigo = "";
				this.dataProducto[index].costo = 0;
				this.dataProducto[index].stock = 0;
				this.dataProducto[index].conteo = 0;
				this.dataProducto[index].diferencia = 0;
				this.dataProducto[index].movimiento = null;
			} else {
				this.dataProducto[index].codigo = filt['codigoProducto'];
				this.dataProducto[index].costo = filt['costo'];
				this.dataProducto[index].stock = filt['stock'];
			}
		} else {
			this.dataProducto = [{
				productSelect: 0,
				codigo: null,
				costo: 0,
				stock: 0,
				conteo: 0.00,
				diferencia: 0.00,
				movimiento: null,
				valorDiferencia: null
			}];
		}
	}


	sumTotal(d, index) {
		let total = 0;
		this.dataProducto[index].diferencia = this.dataProducto[index].conteo - this.dataProducto[index].stock;
		let diferencia = this.dataProducto[index].diferencia;
		this.resultdifCos = this.dataProducto[index].diferencia * this.dataProducto[index].costo; //res en variable guardada.
		this.dataProducto[index].valorDiferencia = this.resultdifCos;
		for (let i = 0; i < this.dataProducto.length; i++) {
			total += parseFloat(this.dataProducto[i]["valorDiferencia"]);
			this.totalAsiento = total;
		}
		if (diferencia < 0) {
			this.dataProducto[index].movimiento = 'Baja';
		} else {
			this.dataProducto[index].movimiento = 'Alta';
		}
	}

	async validateSave() {
		if (this.permisions.save == "0") {
			this.toastr.info("Usuario no tiene permiso para guardar");
		} else {
			let resp = await this.validateDataGlobal().then((respuesta) => {
				if (respuesta) {
					this.confirmSave("Seguro desea guardar la Toma Fisica?", "SAVE_TOMAFISICA");
				}
			});
		}
	}

	canceFisica() {
		this.vmButtons[0].habilitar = true;
		this.vmButtons[1].habilitar = true;
		this.toma.sucursal = 0;
		this.toma.bodega = 0;
		this.toma.grupo = 0;
		this.observacion = null;
		this.viewDate = new Date();
		this.dataProducto = [{
			productSelect: 0,
			codigo: null,
			costo: 0,
			stock: 0,
			conteo: 0.00,
			diferencia: 0.00,
			movimiento: null,
			valorDiferencia: null
		}];

	}

	closeModal() {
		/* this.processingtwo = false; */
		($("#modalSearchCuenta") as any).modal("hide");
	}

	informacionSearch() {
		/* this.processingtwo = true; */
		$('#modalSearchCuenta').appendTo("body").modal('show');
	}

	showAccounts() {
		/* this.processingthree = true; */
		$('#modalSearchCuentaDos').appendTo("body").modal('show');
	}

	closeModalDos() {
		/* this.processingthree = false; */
		($("#modalSearchCuentaDos") as any).modal("hide");
	}

	validateDataGlobal() {
		let flag = false;
		return new Promise((resolve, reject) => {
			if (this.toma.sucursal == 0) {
				this.toastr.info("Seleccione una Sucursal");
			} else if (this.toma.sucursal != 0 && this.toma.bodega == 0) {
				this.toastr.info("Seleccione una Bodega");
				document.getElementById('idSucursal').focus();
			} else if (this.cuenta.nombreInvenatario == undefined) {
				this.toastr.info("Busque una cuenta de Inventario");
				document.getElementById('idnombreInvenatario').focus();
			} else if (this.cuenta.codigoInventario == undefined) {
				this.toastr.info("Saldo Busque una codigo de Inventario");
				document.getElementById('idcodigoInventario').focus();
			} else if (this.cuenta.nombreTomaFisica == undefined) {
				this.toastr.info("Buscar una cuenta para Toma Fisica ");
				document.getElementById('idnombreTomaFisica').focus();
			} else if (this.cuenta.codigoTomaFisica == undefined) {
				this.toastr.info("Buscar una codigo  para Toma Fisica ");
				document.getElementById('idcodigoTomaFisica').focus();
			} else {
				for (let index = 0; index < this.dataProducto.length; index++) {
					if (this.dataProducto[index].productSelect == 0) {
						this.toastr.info("Falta de Seleccionar los productos Necesarios");
						flag = true;
						break;
					} else if (this.dataProducto[index].conteo == 0) {
						this.vmButtons[1].habilitar = true;
						this.canceFisica();
						this.toastr.info("Revise, El valor del conteo es cero , No se realiza toma Física");
						flag = true;
						break;
					} else if (this.dataProducto[index].diferencia == 0) {
						this.toastr.info("Revise, El valor de la diferencia no puede estar vacio o ser 0");
						flag = true;
						break;
					}
				}
				(!flag) ? resolve(true): resolve(false);
			}
		});
	}

	saveTomaFisica() {
		let data = {
			fk_doc: this.idDoc[0].id,
			fk_empresa: this.dataUser.id_empresa,
			sucursal: this.toma.sucursal == 0 ? 0 : this.toma.sucursal,
			bodega: this.toma.bodega == 0 ? 0 : this.toma.bodega,
			grupo: this.toma.grupo == 0 ? 0 : this.toma.grupo,
			fk_cuenta_inventario: this.cuenta.idCuentaInventario,
			nombre_cuenta_inv: this.cuenta.nombreInvenatario,
			cuenta_contable_inv: this.cuenta.codigoInventario,
			fk_cuenta_toma_fisica: this.cuenta.idCuentaTomaFisica,
			nombre_cuenta_tf: this.cuenta.nombreTomaFisica,
			cuenta_contable_tf: this.cuenta.codigoTomaFisica,
			observacion: this.observacion == undefined ? null : this.observacion,
			valorOriginal: this.totalAsiento,
			totalAsiento: this.totalAsiento < 0 ? Math.abs(this.totalAsiento) : this.totalAsiento,
			id_usuario: this.dataUser.id_usuario,
			nombre: this.dataUser.nombre,
			tomaFisica_dt: this.dataProducto,
			ip: this.commonServices.getIpAddress(),
			accion: `Registro guardado de Toma Física de la Sucursal ${this.toma.sucursal} `,
			id_controlador: myVarGlobals.fTomaFisica,
		};
		this.tomafisicaSrv.SaveInfoTomaFisica(data).subscribe(
			(res) => {
				this.toastr.success(res["message"]);
				setTimeout(() => {
					location.reload();
				}, 300);
			},
			(error) => {
				this.toastr.info(error.error.message);
			}
		);
	}
	async confirmSave(message, action) {
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
				if (action == "SAVE_TOMAFISICA") {
					this.saveTomaFisica();
				}
			}
		})
	}

	addItems() {
		if (this.permisions.agregar == "0") {
			this.toastr.info("Usuario no tiene permiso para agregar");
		} else {
			let items = {
				productSelect: 0,
				codigo: null,
				costo: 0,
				stock: 0,
				conteo: 0.00,
				diferencia: 0.00,
				movimiento: null,
				valorDiferencia: null
			};
			this.dataProducto.push(items);
		}
	}

	deleteItems(index) {
		if (this.permisions.eliminar == "0") {
			this.toastr.info("Usuario no tiene permiso para eliminar");
		} else {
			this.dataProducto.splice(index, 1);
			/* this.canceFisica(index); */
		/* 	this.canceFisica(); */
		}
	}

}