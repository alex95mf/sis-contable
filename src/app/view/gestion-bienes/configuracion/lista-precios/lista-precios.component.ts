import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ListaPreciosService } from './lista-precios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
import { ExcelService } from 'src/app/services/excel.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
standalone: false,
	selector: 'app-lista-precios',
	templateUrl: './lista-precios.component.html',
	styleUrls: ['./lista-precios.component.scss']
})
export class ListaPreciosComponent implements OnInit {

	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	//dtOptions: any = {};
	 dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	infoData: any;
	dataEmpresa: any;
	processing: any = false;
	permisions: any;
	validaDtUser: any = false;
	dataUser: any;
	precioSelect: any = 0;
	precioSelectView: any;
	listaCatalogo: any = []
	productoSelectView: any;
	productoSelect: any = 0;
	dataTipoPrecios: any = [];
	arrayProducto: any = [];
	dsPrint: any = false;
	empresLogo: any;
	vmButtons: any = [];
	dataRuc: any;
	guardaT: any = [];
	dataCompany: any;
	dataDireccion: any;
	dataSucursal: any;
	dataTlefono: any;
	disPrecio: any = false;
	disProducto: any = false;
	hoy: Date = new Date;
	fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
	hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
	dateNow: any;
	arrayMark: any = [];
	arrayGroup: any = [];
	marcaSelect: any = 0;
	grupoSelect: any = 0;
	excelData: any = [];
	mensajeSpinner: string = "Guardando Precios...";
	constructor(private toastr: ToastrService,
		private router: Router,
		private reportesSrv: ListaPreciosService,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private excelService: ExcelService) { }

	ngOnInit(): void {
		this.dateNow = moment(this.hoy).format('YYYY-MM-DD');
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		this.vmButtons = [
			//{ orig: "btnslistaPrecios", paramAccion: "", boton: { icon: "fa fa-save", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: true },
			{ orig: "btnslistaPrecios", paramAccion: "", boton: { icon: "fa fa-save", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: true },
			{ orig: "btnslistaPrecios", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true },
			{ orig: "btnslistaPrecios", paramAccion: "", boton: { icon: "fa fa-print", texto: "EXPORTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnslistaPrecios", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false }
		];

		setTimeout(() => {
			this.getPermisions();
		}, 10);

		setTimeout(() => {
			this.catalogo()
		}, 0);


	}

	getPermisions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		this.dataRuc = this.dataUser.company.ruc;
		this.dataCompany = this.dataUser.company.razon_social;
		this.dataDireccion = this.dataUser.company.direccion;
		this.empresLogo = this.dataUser.logoEmpresa;
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fRListaProducto,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.toastr.info("Usuario no tiene acceso a este formulario.");
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
			} else {
				//this.getSucursal();
				this.getTableInitPrice();
				/* this.vmButtons[0].habilitar = true; */
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	/*getSucursal() {
		this.reportesSrv.getSucursales().subscribe(res => {
			this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
			this.dataTlefono = this.dataSucursal.telefono1;
			this.getProduct();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getProduct() {
		this.reportesSrv.getSelectProductos().subscribe(res => {
			this.arrayProducto = res['data'];
			this.GroupPrices();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	GroupPrices() {
		this.reportesSrv.getGroupPrices().subscribe(res => {
			this.dataTipoPrecios = res['data'];
			this.getTableInitPrice();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}*/



	getTableInitPrice() {
		let data = {
			producto: this.productoSelect == 0 ? null : this.productoSelect,
		}
		this.dtOptions = {
			pagingType: 'full_numbers',
			pageLength: 50,
			search: true,
			paging: true,
			// scrollY: "375px",
			// scrollCollapse: true,
			language: {
				url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
			}
		};
		// console.log(data);
		this.lcargando.ctlSpinner(true)
		(this as any).mensajeSpinner = 'Actualizando'
		this.reportesSrv.getProducts(data).subscribe(
			(res: any) => {
				console.log(res)
				res.data.map((item: any) => Object.assign(item, { actualizacion: false }))
				// this.lcargando.ctlSpinner(false);
				this.validaDt = true;
				this.infoData = res['data'];
				/* setTimeout(() => {
					this.dtTrigger.next(null);
				}, 50); */
				this.getMarkGroup(this.infoData);
				localStorage.setItem('dataProductsInit', JSON.stringify(this.infoData));
				this.lcargando.ctlSpinner(false);
			},
			(error: any) => {
				console.log(error)
				this.lcargando.ctlSpinner(false);
				/* setTimeout(() => {
					this.dtTrigger.next(null);
				}, 50); */
			});
	}


	getMarkGroup(arryMarkGroup) {
		let marca = [];
		let grupo = [];

		let objMark = {};
		let objGroup = {};

		arryMarkGroup.forEach(element => {
			objMark = {};
			objGroup = {};
			if (this.arrayMark.length > 0) {
				marca = this.arrayMark.filter(e => e.marca == element['marca']);
				if (marca.length == 0) {
					objMark['nombre'] = element['marca']
					objMark['marca'] = element['marca']
					this.arrayMark.push(objMark);
				}
			} else {
				objMark['nombre'] = element['marca']
				objMark['marca'] = element['marca']
				this.arrayMark.push(objMark);
			}

			if (this.arrayGroup.length > 0) {
				grupo = this.arrayGroup.filter(ev => ev.grupo == element['nombreGrupo']);
				if (grupo.length == 0) {
					objGroup['nombregrupo'] = element['nombreGrupo']
					objGroup['grupo'] = element['nombreGrupo']
					this.arrayGroup.push(objGroup);
				}
			} else {
				objGroup['nombregrupo'] = element['nombreGrupo']
				objGroup['grupo'] = element['nombreGrupo']
				this.arrayGroup.push(objGroup);
			}
		});
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			//case "CONSULTAR":
			//this.getPermisions();
			//this.getTableInitPrice();
			//break;
			case "ACTUALIZAR":
				this.actualizarPrecios();
				break;
			case "CANCELAR":
				this.informaciondtlimpiar();
				break;
			case "IMPRIMIR":
				this.savePrint();
				break;
			case "EXPORTAR":
				this.btnExportar();
				break;
		}
	}


	actualizarPrecios() {
		(this as any).mensajeSpinner = 'Guardando Precios...';
		this.lcargando.ctlSpinner(true);

		let productosActualizados = { infodata: this.infoData.filter((item: any) => item.actualizacion == true) }

		this.reportesSrv.updatePrecios(productosActualizados).subscribe(
			(res: any) => {
				// console.log(res)
				this.infoData.map((item: any) => Object.assign(item, { actualizacion: false }))
				Swal.fire({
					icon: "success",
					title: "Exito",
					// Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
					text: 'Se guardaron exitosamente los Precios',
					showCloseButton: true,
					confirmButtonText: "Aceptar",
					confirmButtonColor: '#20A8D8',
				});
				this.lcargando.ctlSpinner(false);
			},
			(error: any) => {
				this.lcargando.ctlSpinner(false);

			});

	}

	btnExportar() {
		this.excelData = [];
		if (this.permisions.exportar == "0") {
			this.toastr.info("Usuario no tiene permiso para exportar");
		} else {
			Object.keys(this.infoData).forEach(key => {
				let filter_values = {};
				filter_values['Item'] = key;
				filter_values['Código'] = this.infoData[key]['codigoproducto'];
				filter_values['Nombre'] = this.infoData[key]['nombre'];
				filter_values['Marca'] = this.infoData[key]['marca'];
				filter_values['Grupo'] = this.infoData[key]['nombreGrupo'];
				filter_values['Stock'] = this.parseFloatStock(this.infoData[key]['stock']);
				filter_values['pvp'] = this.infoData[key]['pvp'];
				filter_values['precio1'] = this.infoData[key]['precio1'];
				filter_values['precio2'] = this.infoData[key]['precio2'];
				filter_values['precio3'] = this.infoData[key]['precio3'];
				filter_values['precio4'] = this.infoData[key]['precio4'];
				filter_values['precio5'] = this.infoData[key]['precio5'];

				this.excelData.push(filter_values);
			})
			this.exportAsXLSX();
		}
	}

	exportAsXLSX() {
		this.excelService.exportAsExcelFile(this.excelData, 'Lista precios');
	}

	cargarProductos(evt) {
		this.lcargando.ctlSpinner(true);
		// this.lcargando.ctlSpinner(false);
		this.validaDt = true;
		// let info = JSON.parse(localStorage.getItem('dataProductsInit'));
		/* this.vmButtons[0].habilitar = false; */

		// //setTimeout(() => {
		// this.infoData = info.filter(e => e.id_producto == evt);
		// console.log(evt);

		// this.dtOptions = {
		// 	pagingType: 'full_numbers',
		// 	pageLength: 8,
		// 	search: true,
		// 	paging: true,
		// 	scrollY: "375px",
		// 	scrollCollapse: true,
		// 	language: {
		// 		url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
		// 	}
		// };

		let data = {
			producto: evt == 0 ? null : evt,
		}
		console.log(data);
		this.reportesSrv.getProducts(data).subscribe(res => {
			console.log(res)
			this.lcargando.ctlSpinner(false);
			this.validaDt = true;
			let response = res['data'].map((item: any) => Object.assign(item, { actualizacion: false }))


			this.infoData = response;
			setTimeout(() => {
				this.dtElement.dtInstance.then((dtInstance: any) => {
					dtInstance.destroy()
					this.dtTrigger.next(null);
				})
			}, 0);


		});
		// if (evt != 0) {
		// 	//}, 300);
		// } else {
		// 	this.lcargando.ctlSpinner(false);
		// 	this.validaDt = false;
		// 	this.infoData = [];
		// 	this.productoSelect = 0;

		// }
	}

	setModificar(producto: any) {
		console.log('setModificar')
		producto.actualizacion = true
	}

	guardarProductos() {
		let productosActualizados = this.infoData.filter((item: any) => item.actualizacion == true)


		// Envias al back productosActualizados

		// Despues de recibir la respuesta de actualizacion, Llamar a cargarProductos
	}


	searchProducto(evt): void {

		this.lcargando.ctlSpinner(true);
		this.disPrecio = true;
		if (evt != 0) {
			this.lcargando.ctlSpinner(false);
			this.validaDt = true;
			let info = JSON.parse(localStorage.getItem('dataProductsInit'));
			/* this.vmButtons[0].habilitar = false; */
			if (this.precioSelect != 0) {
				let price = this.dataTipoPrecios.filter(e => e.name_ref == this.precioSelect)[0];
				this.precioSelectView = price.name;
			}

			setTimeout(() => {
				if (this.marcaSelect == 0 && this.grupoSelect == 0) {
					this.infoData = info.filter(e => e.id_producto == evt);
				} else if (this.marcaSelect == 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.id_producto == evt && e.nombreGrupo == this.grupoSelect);
				} else if (this.marcaSelect != 0 && this.grupoSelect == 0) {
					this.infoData = info.filter(e => e.id_producto == evt && e.marca == this.marcaSelect);
				} else if (this.marcaSelect != 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.id_producto == evt && e.marca == this.marcaSelect && e.nombreGrupo == this.grupoSelect);
				}
				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
			}, 300);
		} else {
			this.lcargando.ctlSpinner(false);
			this.validaDt = false;
			this.infoData = [];
			this.productoSelect = 0;
			this.precioSelect = 0;
			this.grupoSelect = 0;
			this.marcaSelect = 0;


			setTimeout(() => {
				this.infoData = JSON.parse(localStorage.getItem('dataProductsInit'));
				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
				this.validaDt = true;
				this.productoSelect = 0;
				this.precioSelect = 0;
				this.disPrecio = false;
				this.disProducto = false;
			}, 300);
		}
	}


	searchTipePrice() {
		this.lcargando.ctlSpinner(true);
		this.disProducto = true;
		if (this.precioSelect != 0) {
			let price = this.dataTipoPrecios.filter(e => e.name_ref == this.precioSelect)[0];
			this.precioSelectView = price.name;
			/* this.vmButtons[0].habilitar = false; */
			this.lcargando.ctlSpinner(false);
		} else if (this.precioSelect == 0) {
			this.productoSelect = 0;
			this.disPrecio = false;
			this.disProducto = false;
			/* this.vmButtons[0].habilitar = true; */
			this.lcargando.ctlSpinner(false);

		}
	}

	searchMark(evt) {
		this.lcargando.ctlSpinner(true);
		this.disPrecio = true;
		if (evt != 0) {
			this.lcargando.ctlSpinner(false);
			if (this.precioSelect != 0) {
				let price = this.dataTipoPrecios.filter(e => e.name_ref == this.precioSelect)[0];
				this.precioSelectView = price.name;
			}
			this.validaDt = true;
			let info = JSON.parse(localStorage.getItem('dataProductsInit'));
			setTimeout(() => {

				if (this.productoSelect == 0 && this.grupoSelect == 0) {
					this.infoData = info.filter(e => e.marca == evt);
				} else if (this.productoSelect == 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.marca == evt && e.nombreGrupo == this.grupoSelect);
				} else if (this.productoSelect != 0 && this.grupoSelect == 0) {
					this.infoData = info.filter(e => e.marca == evt && e.id_producto == this.productoSelect);
				} else if (this.marcaSelect != 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.marca == evt && e.id_producto == this.productoSelect && e.nombreGrupo == this.grupoSelect);
				}

				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
			}, 300);
		} else {
			this.lcargando.ctlSpinner(false);
			this.validaDt = false;
			this.infoData = [];

			setTimeout(() => {
				/* this.infoData = JSON.parse(localStorage.getItem('dataProductsInit')); */
				let info = JSON.parse(localStorage.getItem('dataProductsInit'));
				if (this.productoSelect == 0 && this.grupoSelect == 0) {
					this.infoData = JSON.parse(localStorage.getItem('dataProductsInit'));
				} else if (this.productoSelect == 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.nombreGrupo == this.grupoSelect);
				} else if (this.productoSelect != 0 && this.grupoSelect == 0) {
					this.infoData = info.filter(e => e.id_producto == this.productoSelect);
				} else if (this.marcaSelect != 0 && this.grupoSelect != 0) {
					this.infoData = info.filter(e => e.id_producto == this.productoSelect && e.nombreGrupo == this.grupoSelect);
				}

				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
				this.validaDt = true;
			}, 300);
		}
	}

	searchGroup(evt) {
		this.lcargando.ctlSpinner(true);
		this.disPrecio = true;
		if (evt != 0) {
			this.lcargando.ctlSpinner(false);
			if (this.precioSelect != 0) {
				let price = this.dataTipoPrecios.filter(e => e.name_ref == this.precioSelect)[0];
				this.precioSelectView = price.name;
			}
			this.validaDt = true;
			let info = JSON.parse(localStorage.getItem('dataProductsInit'));
			setTimeout(() => {

				if (this.productoSelect == 0 && this.marcaSelect == 0) {
					this.infoData = info.filter(e => e.nombreGrupo == evt);
				} else if (this.productoSelect == 0 && this.marcaSelect != 0) {
					this.infoData = info.filter(e => e.nombreGrupo == evt && e.marca == this.marcaSelect);
				} else if (this.productoSelect != 0 && this.marcaSelect == 0) {
					this.infoData = info.filter(e => e.nombreGrupo == evt && e.id_producto == this.productoSelect);
				} else if (this.productoSelect != 0 && this.marcaSelect != 0) {
					this.infoData = info.filter(e => e.nombreGrupo == evt && e.id_producto == this.productoSelect && e.marca == this.marcaSelect);
				}

				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
			}, 300);
		} else {
			this.lcargando.ctlSpinner(false);
			this.validaDt = false;
			this.infoData = [];

			setTimeout(() => {
				let info = JSON.parse(localStorage.getItem('dataProductsInit'));

				if (this.productoSelect == 0 && this.marcaSelect == 0) {
					this.infoData = JSON.parse(localStorage.getItem('dataProductsInit'));
				} else if (this.productoSelect == 0 && this.marcaSelect != 0) {
					this.infoData = info.filter(e => e.marca == this.marcaSelect);
				} else if (this.productoSelect != 0 && this.marcaSelect == 0) {
					this.infoData = info.filter(e => e.id_producto == this.productoSelect);
				} else if (this.productoSelect != 0 && this.marcaSelect != 0) {
					this.infoData = info.filter(e => e.id_producto == this.productoSelect && e.marca == this.marcaSelect);
				}

				if (this.infoData.length == 0) {
					this.vmButtons[0].habilitar = true;
					this.vmButtons[1].habilitar = true;
				} else {
					this.vmButtons[0].habilitar = false;
					this.vmButtons[1].habilitar = false;
				}
				this.validaDt = true;
			}, 300);
		}
	}

	informaciondtlimpiar() {
		this.precioSelect = 0;
		this.productoSelect = 0;
		this.validaDt = false;
		this.disPrecio = false;
		this.disProducto = false;
		this.infoData = [];
		setTimeout(() => {
			this.productoSelect = 0;
			this.infoData = JSON.parse(localStorage.getItem('dataProductsInit'));
			this.validaDt = true;
			this.productoSelect = 0;
		}, 500);
	}

	savePrint() {
		let data = {
			ip: this.commonServices.getIpAddress(),
			accion: "Registro de impresion Lista de Precios",
			id_controlador: myVarGlobals.fRListaProducto,
		}
		this.reportesSrv.printData(data).subscribe(res => { }, error => {
			this.toastr.info(error.error.mesagge);
		})
	}

	parseFloatStock(num) {
		return parseFloat(num).toFixed(2);
	}

	catalogo() {

		this.reportesSrv.listarCatalogo({}).subscribe((res: any) => {
			res.map((data) => {
				let datos = {
					valor: data.valor,
					descripcion: data.descripcion
				};
				this.listaCatalogo.push(datos)

			})
		})
	}

}
