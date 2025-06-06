import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { MovContableService } from "./mov-contable.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { MovAsientoComponent } from './mov-asiento/mov-asiento.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';

import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { PlanCuentasService } from '../../plan-cuentas/plan-cuentas.service'

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';


import { environment } from 'src/environments/environment';
import { Console } from 'console';
import { ActivatedRoute } from '@angular/router';

declare const $: any;
@Component({
standalone: false,
	selector: 'app-mov-contable',
	templateUrl: './mov-contable.component.html',
	styleUrls: ['./mov-contable.component.scss'],
	providers: [DialogService]
})
export class MovContableComponent implements OnInit {



	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective)
	@ViewChild('content') templateRef: TemplateRef<any>;


	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	presentDt: any = false;
	infomovData: any = [];
	infomovDataExcel: any = [];
	/* processing: any = false; */
	processingtwo: any = false;
	permisions: any;
	dataUser: any;
	viewDate: Date = new Date();
	// fromDatePicker = moment().startOf('month').format('YYYY-MM-DD');
	// toDatePicker = moment().format('YYYY-MM-DD');
	today: any;
	tomorrow: any;
	firstday: any;
	lastday:any;
	fromDatePicker: any;
	toDatePicker: any;

	codigo: any = '';
	nombre: any = '';

	codigo_hasta: any = '';
	nombre_hasta: any = '';

	anio:number
	mes: number

	fecha_desde: number
	fecha_hasta: number
	codigo_cuenta: any = ''

	tipo: any = 0;
	numero: any = 0;
	locality: any;
	actual: any = 0;
	anterior: any = 0;
	totalValor: any;
	dataSactual: any
	dataSanterior: any;
	numData: Array<any> = [];
	arrayCodigo: Array<any> = [];
	arrayNombre: Array<any> = [];
	arrayTipo: Array<any> = [];
	arrayCab: Array<any> = [];
	vmButtons: any = [];
	dataAnterior: any;
	dataSucursal: any;
	empresLogo: any;
	dataTotal: any = {
		countRegistros: 0,
		Debe: 0,
		Haber: 0,
		Saldo: 0
	};
	formatTotal: any;
	hoy: Date = new Date;
	fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
	hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
	constructor
		(
			private socket: Socket,
			private toastr: ToastrService,
			private pCuentasService: PlanCuentasService,
			private router: Router,
			private reportesSrv: MovContableService,
			private modalService: NgbModal,
			private commonServices: CommonService,
			private commonVarSrv: CommonVarService,
			public dialogService: DialogService,
			private excelService: ExcelService,
    		private xlsService: XlsExportService,
			private route: ActivatedRoute
		) { }



	ref: DynamicDialogRef;

	ngOnInit(): void {

		this.route.params.subscribe(params => {
			console.log(params)
			if (Object.keys(params).length === 0) {
				console.log('El objeto params está vacío.');
			}else{
				console.log(params)
				this.fecha_desde = +params['fecha_desde']
				this.fecha_hasta = +params['fecha_hasta']
				this.codigo_cuenta = params['codigo_cuenta']
				console.log(params['codigo_cuenta'])

				let fechaDesde = String(this.fecha_desde);
				let fechaHasta = String(this.fecha_hasta);

				// Insertar guiones en las posiciones 5 y 8
				let nuevaFechaDesde = fechaDesde.slice(0, 4) + '-' + fechaDesde.slice(4, 6) + '-' + fechaDesde.slice(6,8);
				this.fromDatePicker =nuevaFechaDesde

				this.codigo = this.codigo_cuenta
				this.codigo_hasta  = this.codigo_cuenta

				let nuevaFechaHasta = fechaHasta.slice(0, 4) + '-' + fechaHasta.slice(4, 6) + '-' + fechaHasta.slice(6,8);
				this.toDatePicker =nuevaFechaHasta
				if(this.codigo_cuenta!= ''){
					let data = {
						dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
						monthFrom: moment(this.fromDatePicker).format('MM'),
						yearFrom: moment(this.fromDatePicker).format('YYYY'),
						dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
						codigo: this.codigo == 0 ? null : this.codigo,
						nombre: this.nombre == 0 ? null : this.nombre,
						codigo_hasta: this.codigo_hasta == 0 ? null : this.codigo_hasta,
						nombre_hasta: this.nombre_hasta == 0 ? null : this.nombre_hasta,
						tipo: this.tipo == 0 ? null : this.tipo,
						numero: this.numero == 0 ? null : this.numero,
						codigo_oficial: this.codigo_cuenta
					}
					this.reportesSrv.getMovimientoContable(data).subscribe(res => {

						console.log(res['data']);
						this.lcargando.ctlSpinner(false);
						this.presentDt = true;


							let control_cuenta = ''
							let saldo_anterior = 0

							res['data'].forEach(element => {
							if(control_cuenta!=element.codigo){
								saldo_anterior= parseFloat(element.saldo_inicial)
								control_cuenta = element.codigo
								Object.assign(element, {saldo: saldo_anterior })

							}
								saldo_anterior += parseFloat(element.valor_deb) - parseFloat(element.valor_cre)
								Object.assign(element, {
											codigo:	element.codigo,
											nom_cuenta:	element.nom_cuenta,
											asiento:	element.asiento,
											ref_num_doc:	element.ref_num_doc,
											glosa:	element.glosa,
											centro_costo:	element.centro_costo,
											valor_deb:	parseFloat(element.valor_deb),
											valor_cre:	parseFloat(element.valor_cre),
											saldo: saldo_anterior })

							});
							this.infomovData = res['data'];

					}, error => {
						this.toastr.info(error.error.mesagge);
						this.lcargando.ctlSpinner(false);
					});
				}
			}


		  });
		  this.today = new Date();
		  this.tomorrow = new Date(this.today);
		  this.tomorrow.setDate(this.tomorrow.getDate() + 1);
		  this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
		  this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

		  this.fromDatePicker=moment(this.firstday).format('YYYY-MM-DD');
		  this.toDatePicker= moment(this.today).format('YYYY-MM-DD');


		this.vmButtons = [

			{
				orig: "btnsRmovContable",
				paramAccion: "",
				boton: {
					icon: "fa fa-search",
					texto: "CONSULTAR"
				},
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				clase: "btn btn-primary boton btn-sm",
				habilitar: false,
				printSection: "print-section-contable",
				imprimir: false
			}, {
				orig: "btnsRmovContable",
				paramAccion: "",
				boton: {
					icon: "fa fa-file-excel-o",
					texto: "EXCEL"
				},
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				clase: "btn btn-success boton btn-sm",
				habilitar: false,
				imprimir: false
			},
			{
				orig: "btnsRmovContable",
				paramAccion: "",
				boton: {
					icon: "fa fa-file-pdf-o",
					texto: "PDF"
				},
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				clase: "btn btn-danger boton btn-sm",
				habilitar: false,
				printSection: "print-section-contable",
				imprimir: false
			},
			{
				orig: "btnsRmovContable",
				paramAccion: "",
				boton: {icon: "fas fa-eraser", texto: "LIMPIAR" },
				clase: "btn btn-warning boton btn-sm",
				permiso: true,
				showtxt: true,
				showimg: true,
				showbadge: false,
				habilitar: false,
			  },
		];
		setTimeout(() => {
			this.getPermisions();
		}, 10);
	}

	getPermisions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		this.empresLogo = this.dataUser.logoEmpresa;
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fRImportaciones,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.abrir == "0") {
				this.toastr.info("Usuario no tiene permiso para Consultar Movimientos Contables.");
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
			} else {
				this.getSucursal();
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			// case "IMPRIMIR":
			// 	this.GenerarReporteHtml();
			// 	break;
			case "LIMPIAR":
				this.limpiarFiltros()
				break;
			case "EXCEL":
				this.GenerarReporteExcel();
				break;
			case "CONSULTAR":
				this.getDetailsMove();
				break;
			case "PDF":
				this.GenerarReportePdf();
				break;
		}
	}

	savePrint() {
		if (this.permisions.imprimir == "0") {
			this.toastr.info("Usuario no tiene Permiso para imprimir");
		} else {
			let data = {
				ip: this.commonServices.getIpAddress(),
				accion: "Registro de impresion de Mayor de cuentas",
				id_controlador: myVarGlobals.fRImportaciones
			}
			this.reportesSrv.printData(data).subscribe(res => {
			}, error => {
				this.toastr.info(error.error.mesagge);
			})
		}
	}

	// GenerarReporteExcel() {

	// 	let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYYMMDD');
	// 	let PrimerDiaMes = moment(new Date(moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD'))).startOf('month').format('YYYYMMDD');
	// 	let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
	// 	let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
	// 	let codigo = this.codigo == 0 ? "" : this.codigo;
	// 	let codigo_hasta = this.codigo_hasta == 0 ? null : this.codigo_hasta;
	// 	window.open(environment.ReportingUrl + "rpt_mayor_cuentas.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&cuenta_hasta="+codigo_hasta+"&fecha_desde="+dateFrom+"&fecha_primermesanterior="+PrimerDiaMes+"&cuenta="+codigo+"&fecha_diaanterior="+Dianterior+"&id_empresa=1&fecha_hasta="+dateTo, '_blank')
	// }

	GenerarReporteExcel(){

		(this as any).mensajeSpinner = "Generando Archivo Excel...";
		this.lcargando.ctlSpinner(true);
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			monthFrom: moment(this.fromDatePicker).format('MM'),
			yearFrom: moment(this.fromDatePicker).format('YYYY'),
			codigo: this.codigo == 0 ? null : this.codigo,
			nombre: this.nombre == 0 ? null : this.nombre,
			codigo_hasta: this.codigo_hasta == 0 ? null : this.codigo_hasta,
			nombre_hasta: this.nombre_hasta == 0 ? null : this.nombre_hasta,
			tipo: this.tipo == 0 ? null : this.tipo,
			numero: this.numero == 0 ? null : this.numero,
		}
		this.reportesSrv.getMovimientoContable(data).subscribe(res => {
			console.log(res['data'])
			this.infomovDataExcel = res['data'];
			if(this.infomovDataExcel.length > 0){

				let data = {
				  title: 'Mayor de Cuentas',
				  razon_social: 'Gobierno Autonomo Descentralizado',
				  razon_comercial: 'Gobierno Autonomo Descentralizado',
				  direccion: 'Canton La Libertad',
				  fecha_desde: this.fromDatePicker,
				  fecha_hasta: this.toDatePicker,
				//   cuenta_desde: this.fromDatePicker,
				//   cuenta_hasta: this.toDatePicker,
				  rows:  this.infomovDataExcel
				}
				console.log(data);
			  this.xlsService.exportExcelMayorCuentas(data, 'Mayor de Cuentas')
				// let tipo = 'Asiento'
				// this.exportAsXLSX(this.fieldsDaily,tipo);
				this.lcargando.ctlSpinner(false);
			  }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false);
			  }
		}, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});


	  }

	  exportAsXLSX(excelData,titpo) {
		this.excelService.exportAsExcelFile(excelData, titpo);
	  }


	GenerarReportePdf() {

		let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYYMMDD');
		let PrimerDiaMes = moment(new Date(moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD'))).startOf('month').format('YYYYMMDD');
		let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
		let codigo = this.codigo == 0 ? "" : this.codigo;
		let codigo_hasta = this.codigo_hasta == 0 ? '' : this.codigo_hasta;

		window.open(environment.ReportingUrl + "rpt_mayor_cuentas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&cuenta_hasta="+codigo_hasta+"&fecha_desde="+dateFrom+"&fecha_primermesanterior="+PrimerDiaMes+"&cuenta="+codigo+"&fecha_diaanterior="+Dianterior+"&id_empresa=1&fecha_hasta="+dateTo, '_blank')
	}

	GenerarReporteHtml() {

		let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYYMMDD');
		let PrimerDiaMes = moment(new Date(moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD'))).startOf('month').format('YYYYMMDD');
		let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
		let codigo = this.codigo == 0 ? "" : this.codigo;
		let codigo_hasta = this.codigo_hasta == 0 ? null : this.codigo_hasta;

		window.open(environment.ReportingUrl + "rpt_mayor_cuentas.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&cuenta_hasta="+codigo_hasta+"&fecha_desde="+dateFrom+"&fecha_primermesanterior="+PrimerDiaMes+"&cuenta="+codigo+"&fecha_diaanterior="+Dianterior+"&id_empresa=1&fecha_hasta="+dateTo, '_blank')
	}

	getAccountsDetails() {
		let data = {
			company_id: this.dataUser.id_empresa
		};
		this.reportesSrv.getAccountsByDetails(data).subscribe(res => {
			this.arrayCodigo = res["data"];
			this.arrayNombre = res["data"];
			this.getDocumentsDetails();
		}, error => {
			this.lcargando.ctlSpinner(false);
		})
	}

	getDocumentsDetails() {
		this.reportesSrv.getDocumentData().subscribe(res => {
			this.arrayTipo = res["data"];
			this.lcargando.ctlSpinner(false);
		}, error => {
			this.lcargando.ctlSpinner(false);
		})
	}

	getSucursal() {
		this.reportesSrv.getSucursales().subscribe(res => {
			this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
			this.getAccountsDetails();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 2
		})
		params = params.replace(/[,.]/g, function (m) {
			return m === ',' ? '.' : ',';
		});
		return params;
	}

	filterCodigo(data) {

		if (data != 0 || this.nombre != 0) {
			this.lcargando.ctlSpinner(true);
			this.codigo = data;
			let f = this.arrayCodigo.find(el => el.codigo === this.codigo);
			this.nombre = f.nombre;
			this.getSaldoAnterior();
			this.getDetailsMove();
		} else {
			this.limpiarMov();
		}
	}

	filterNombre(data) {
		if (data != 0 || this.codigo != 0) {
			this.lcargando.ctlSpinner(true);
			this.nombre = data;
			let f = this.arrayNombre.find(el => el.nombre === this.nombre);
			this.codigo = f.codigo;
			this.getSaldoAnterior();
			this.getDetailsMove();
		} else {
			this.limpiarMov();
		}
	}

	filterTipo(data) {

		if (data != 0) {
			this.lcargando.ctlSpinner(true);
			this.tipo = data;
			let datas = {
				codigo: this.tipo
			};
			this.reportesSrv.getmovCab(datas).subscribe(res => {
				this.arrayCab = res["data"];
				if (this.codigo != 0 || this.nombre != 0) {
					this.lcargando.ctlSpinner(false);
					this.getSaldoAnterior();
					this.getDetailsMove();
				} else {
					this.lcargando.ctlSpinner(false);
					this.infomovData = [];
					this.dataTotal = {
						countRegistros: 0,
						Debe: 0,
						Haber: 0,
						Saldo: 0
					};
					this.actual = 0;
					this.anterior = 0;
				}

			});
		} else {
			this.limpiarMov();
		}
	}

	filterNumero(data) {
		this.lcargando.ctlSpinner(true);
		if (data != 0) {
			this.numero = data;
			if (this.codigo != 0 || this.nombre != 0) {
				this.getSaldoAnterior();
				this.getDetailsMove();
				this.lcargando.ctlSpinner(false);
			} else {
				this.limpiarCalculo();
				this.lcargando.ctlSpinner(false);
			}

		} else {
			this.limpiarMov();
		}
	}

	FromOrToChange() {

		this.fechasValida();
		if (this.codigo != 0 || this.nombre != 0) {
			this.lcargando.ctlSpinner(true);
			this.getSaldoAnterior();
			this.getDetailsMove();
		}
	}

	getDetailsMove() {

		this.lcargando.ctlSpinner(true);

		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			monthFrom: moment(this.fromDatePicker).format('MM'),
			yearFrom: moment(this.fromDatePicker).format('YYYY'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			codigo: this.codigo == 0 ? null : this.codigo,
			nombre: this.nombre == 0 ? null : this.nombre,
			codigo_hasta: this.codigo_hasta == 0 ? null : this.codigo_hasta,
			nombre_hasta: this.nombre_hasta == 0 ? null : this.nombre_hasta,
			tipo: this.tipo == 0 ? null : this.tipo,
			numero: this.numero == 0 ? null : this.numero,
			codigo_oficial: this.codigo_cuenta
		}
		this.reportesSrv.getMovimientoContable(data).subscribe(res => {

			console.log(res['data']);
			this.lcargando.ctlSpinner(false);
			this.presentDt = true;


				let control_cuenta = ''
				let saldo_anterior = 0

				res['data'].forEach(element => {
				if(control_cuenta!=element.codigo){
					saldo_anterior= parseFloat(element.saldo_inicial)
					control_cuenta = element.codigo
					Object.assign(element, {saldo: saldo_anterior })

				}
					saldo_anterior += parseFloat(element.valor_deb) - parseFloat(element.valor_cre)
					Object.assign(element, {
								codigo:	element.codigo,
								nom_cuenta:	element.nom_cuenta,
								asiento:	element.asiento,
								ref_num_doc:	element.ref_num_doc,
								glosa:	element.glosa,
								centro_costo:	element.centro_costo,
								valor_deb:	parseFloat(element.valor_deb),
								valor_cre:	parseFloat(element.valor_cre),
								saldo: saldo_anterior })

				});
				this.infomovData = res['data'];
			// this.infomovData = res['data'];
			// if (this.infomovData.length > 0) {
			// 	this.lcargando.ctlSpinner(false);
			// 	this.vmButtons[1].habilitar = false;
			// 	this.CalculoTotal();
			// 	this.getSaldoAnterior();
			// } else {
			// 	this.lcargando.ctlSpinner(false);
			// 	this.dataTotal = {
			// 		countRegistros: 0,
			// 		Debe: 0,
			// 		Haber: 0,
			// 		Saldo: 0
			// 	};
			// }
		}, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});
	}

	fechasValida() {
		// let fechaActualUno = moment(this.fromDatePicker).format("YYYY-MM-DD")
		// let fechaActualCambio = moment(this.toDatePicker).format("YYYY-MM-DD")
		let fechaActual = moment().add(1, 'd').format("YYYY-MM-DD")

		if (this.toDatePicker > fechaActual) {
			this.toastr.info("Fecha No puede ser Mayor" + " " + fechaActual);
			this.toDatePicker = moment().format('YYYY-MM-DD');
		} else if (this.fromDatePicker > fechaActual) {
			this.toastr.info("Fecha No puede ser Mayor" + " " + fechaActual);
			this.fromDatePicker = moment().startOf('month').format('YYYY-MM-DD');
		}
	}

	limpiarCalculo() {
		this.infomovData = [];
		this.dataTotal = {
			countRegistros: 0,
			Debe: 0,
			Haber: 0,
			Saldo: 0
		};
		this.actual = 0;
		this.anterior = 0;
	}
	limpiarMov() {

		this.vmButtons[1].habilitar = true;
		this.infomovData = [];
		this.codigo = '';
		this.nombre = '';
		this.tipo = 0;
		this.numero = 0;
		this.actual = 0;
		this.anterior = 0;
		this.dataTotal = {
			countRegistros: 0,
			Debe: 0,
			Haber: 0,
			Saldo: 0
		};
		this.fromDatePicker = moment().startOf('month').format('YYYY-MM-DD');
		this.toDatePicker = moment().format('YYYY-MM-DD');
	}

	async ObtenerSaldoAnteriorCodigo(codigo: string) {


		return new Promise((resolve, reject) => {

			let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD');
			let PrimerDiaMes = moment(new Date(Dianterior)).startOf('month').format('YYYY-MM-DD');


			let data = {
				cuenta: codigo,
				desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
				dianterior: Dianterior,
				primerdiames: PrimerDiaMes,
				company_id: this.dataUser.id_empresa,
			}

			this.reportesSrv.getanterior(data).subscribe(res => {

				this.dataSanterior = res['data'];
				this.dataAnterior = res['data'][0].saldoanterior;

				resolve(this.dataAnterior);
/*
				if (isNaN(parseFloat(this.dataAnterior))) {
					this.dataAnterior = 0;
					this.anterior = 0;
					let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.anterior);
					this.formatTotal = datainfo;
					this.actual = this.formatNumber(parseFloat(this.formatTotal));

				} else {
					this.anterior = this.formatNumber(res['data'][0].saldoanterior);
					let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.dataAnterior);
					this.formatTotal = datainfo;
					this.actual = this.formatNumber(parseFloat(this.formatTotal));
				}*/

			}, error => {
				this.toastr.info(error.error.mesagge);
			});

		})

	}



	async SaldoAnteriorCabecera(codigo){

		let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD');
		let PrimerDiaMes = moment(new Date(Dianterior)).startOf('month').format('YYYY-MM-DD');


		let data = {
			cuenta: this.codigo,
			desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dianterior:Dianterior,
			primerdiames:PrimerDiaMes,
			company_id: this.dataUser.id_empresa,
		}
		this.reportesSrv.getanterior(data).subscribe(res => {

			return res['data'];
			//this.dataAnterior = res['data'][0].saldoanterior;

		}, error => {
			this.toastr.info(error.error.mesagge);
		});

	}

	getSaldoAnterior() {


		let Dianterior = moment(this.fromDatePicker).subtract(1, 'days').format('YYYY-MM-DD');
		let PrimerDiaMes = moment(new Date(Dianterior)).startOf('month').format('YYYY-MM-DD');


		let data = {
			cuenta: this.codigo,
			desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dianterior:Dianterior,
			primerdiames:PrimerDiaMes,
			company_id: this.dataUser.id_empresa,
		}
		this.reportesSrv.getanterior(data).subscribe(res => {

			//debugger
			this.dataSanterior = res['data'];
			this.dataAnterior = res['data'][0].saldoanterior;
			if (isNaN(parseFloat(this.dataAnterior))) {
				this.dataAnterior = 0;
				this.anterior = 0;
				let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.anterior);
				this.formatTotal = datainfo;
				this.actual = this.formatNumber(parseFloat(this.formatTotal));

			} else {
				this.anterior = this.formatNumber(res['data'][0].saldoanterior);
				let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.dataAnterior);
				this.formatTotal = datainfo;
				this.actual = this.formatNumber(parseFloat(this.formatTotal));
			}
		}, error => {
			this.toastr.info(error.error.mesagge);
		});
	}

	async CalculoTotal() {


		var TotalDebe = 0;
		var TotalHaber = 0;
		var total = 0;



	    let hash = {};
		let array = this.infomovData.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
		//console.log(array);

		for (let i = 0; i < array.length; i++) {


			let codigoCuentaBus = array[i]['codigo'];
			let ArrayByCuenta = this.infomovData.filter(word => word['codigo'] === codigoCuentaBus);

			//console.log(ArrayByCuenta);

			this.totalValor = 0;
			total = 0;



			await this.ObtenerSaldoAnteriorCodigo(codigoCuentaBus).then(respSaldoAnte => {



				this.dataSanterior = (respSaldoAnte === null) ? 0 : respSaldoAnte;
				//this.dataAnterior = respSaldoAnte[0].saldoanterior;
/*
				if (isNaN(parseFloat(this.dataAnterior))) {
					this.dataAnterior = 0;
					this.anterior = 0;
					let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.anterior);
					this.formatTotal = datainfo;
					this.actual = this.formatNumber(parseFloat(this.formatTotal));

				} else {
					this.anterior = this.formatNumber(respSaldoAnte[0].saldoanterior);
					let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.dataAnterior);
					this.formatTotal = datainfo;
					this.actual = this.formatNumber(parseFloat(this.formatTotal));
				}
*/
				console.log(codigoCuentaBus);
				console.log(this.dataSanterior);
				//Sconsole.log(this.dataAnterior);

				total = parseFloat(this.dataSanterior);

				for(let a = 0; a < ArrayByCuenta.length; a++){

					ArrayByCuenta[a]["saldo_antes"] = this.dataSanterior;

					if (ArrayByCuenta[a]["clase"] == 'DEUDORA') {
						this.dataTotal.countRegistros = ArrayByCuenta.length;

						TotalDebe += parseFloat(ArrayByCuenta[a]["valor_deb"]);
						TotalHaber += parseFloat(ArrayByCuenta[a]["valor_cre"]);
						this.totalValor = parseFloat(ArrayByCuenta[a]["valor_deb"]) - parseFloat(ArrayByCuenta[a]["valor_cre"]);
						total += parseFloat(this.totalValor);
						ArrayByCuenta[a]["saldo"] = total;

					} else {

						this.dataTotal.countRegistros = ArrayByCuenta.length;
						TotalDebe += parseFloat(ArrayByCuenta[a]["valor_deb"]);
						TotalHaber += parseFloat(ArrayByCuenta[a]["valor_cre"]);
						this.totalValor = parseFloat(ArrayByCuenta[a]["valor_cre"]) - parseFloat(ArrayByCuenta[a]["valor_deb"]);
						total += parseFloat(this.totalValor);
						ArrayByCuenta[a]["saldo"] = total;

					}

					ArrayByCuenta[a]["saldo_fin"] = total;


				}



			});






		}/*
		this.dataTotal.Saldo = total;
		this.dataTotal.Debe = TotalDebe;
		this.dataTotal.Haber = TotalHaber;
		*/
	}

	viewAsiento(dt) {

		window.open(environment.ReportingUrl + "rpt_asiento_contable.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + dt.id_asiento, '_blank'/*"http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+res["data"].id, '_blank'*/);


		/*
		const modalInvoice = this.modalService.open(MovAsientoComponent, {
			size: "xl",
			backdrop: 'static',
			windowClass: 'viewer-content-general'
		});
		modalInvoice.componentInstance.dts = dt;*/
	}



	onClicConsultaPlanCuentas(i) {

		//this.lcargando.ctlSpinner(true);

		let busqueda = (typeof this.codigo === 'undefined') ? "" : this.codigo;

		let consulta = {
			busqueda: this.codigo
		}
		localStorage.setItem('detalle_consulta','true')

		this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
			header: 'Cuentas',
			width: '70%',
			contentStyle: { "max-height": "500px", "overflow": "auto" },
			baseZIndex: 10000
		});

		this.ref.onClose.subscribe((cuentas: any) => {
			localStorage.removeItem('detalle_consulta')
			if (cuentas) {

				this.CargarCuentaEditar(cuentas["data"]);
			}

		});


	}


	onClicConsultaPlanCuentasHasta(i) {


		//debugger;
		if (this.codigo === '') {

			this.toastr.info("Debe seleccionar filtro de la cuenta desde donde se desea consultar el mayor.");

		} else {

			this.lcargando.ctlSpinner(true);

			let busqueda = (typeof this.codigo === 'undefined') ? "" : this.codigo;

			let consulta = {
				busqueda: this.codigo
			}
			localStorage.setItem('detalle_consulta','true')

			this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
				header: 'Cuentas',
				width: '70%',
				contentStyle: { "max-height": "500px", "overflow": "auto" },
				baseZIndex: 10000
			});

			this.ref.onClose.subscribe((cuentas: any) => {
				localStorage.removeItem('detalle_consulta')
				if (cuentas) {

					this.CargarCuentaEditarHasta(cuentas["data"]);
					//this.lcargando.ctlSpinner(false);

				}

			});
		}

	}




	CargarCuentaEditar(event: any) {

		this.codigo = event.codigo;
		this.codigo_hasta = event.codigo;

		this.nombre = event.nombre;
		this.nombre_hasta = event.nombre;
		//this.getSaldoAnterior();
		//this.getDetailsMove();
		this.modalService.dismissAll();

	}


	CargarCuentaEditarHasta(event: any) {

		this.codigo_hasta = event.codigo;
		this.nombre_hasta = event.nombre;
		this.getSaldoAnterior();
		this.getDetailsMove();
		this.modalService.dismissAll();

	}
	consultaDetalleDocumento(dt){
		console.log(dt)
		window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + dt.id_asiento, '_blank')

	}

	limpiarFiltros() {

		this.codigo= '';
		this.nombre= '';
		this.codigo_hasta='';
		this.nombre_hasta='';
		this.tipo=0;
		this.numero=0;
		this.codigo_cuenta='';
		this.fromDatePicker=moment(this.firstday).format('YYYY-MM-DD');
		this.toDatePicker= moment(this.today).format('YYYY-MM-DD');

		this.infomovData= [];
		this.infomovDataExcel= [];
	}

}
