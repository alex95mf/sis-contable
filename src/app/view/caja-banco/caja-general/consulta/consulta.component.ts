import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { ConsultaService } from "./consulta.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from "../../../../global";
declare const $: any;
@Component({
standalone: false,
	selector: 'app-consulta-caja',
	templateUrl: './consulta.component.html',
	styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
	mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	processing: any = false;
	totalForma:any = parseFloat('0.00');

	processingQuotes: boolean = false;
	viewDate: Date = new Date();
	fromDatePicker: Date = new Date(
		this.viewDate.getFullYear(),
		this.viewDate.getMonth(),
		1
	);
	toDatePicker: Date = new Date();
	datoTabla: Array<any> = [];
	flag: number = 0;
	arrayPago: Array<any> = [];
	arraybankCajaCab: Array<any> = [];
	cajapunto: Array<any> = [];
	FormaPago: any = 0;
	caja: any = 0;
	user: any = 0
	sucursal:any = 0;
	idcaja: any;
	totalValor: any;
	totalenvio: any;
	vmButtons: any = [];
	dataUser: any;
	permisions: any;
	locality: any;
	arrayUsers: any;
	arraySucursales:any;
	constructor(
		private toastr: ToastrService,
		private router: Router,
		private reporSrv: ConsultaService,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService
	) { }

	ngOnInit(): void {
		this.vmButtons = [{
			orig: "btnsCajaGeneral",
			paramAccion: "",
			boton: {
				icon: "fa fa-eraser",
				texto: "LIMPIAR"
			},
			permiso: true,
			showtxt: true,
			showimg: true,
			showbadge: false,
			clase: "btn btn-dark boton btn-sm",
			habilitar: false,
			imprimir: false
		},
		{
			orig: "btnsCajaGeneral",
			paramAccion: "",
			boton: {
				icon: "fa fa-print",
				texto: "IMPRIMIR"
			},
			permiso: true,
			showtxt: true,
			showimg: true,
			showbadge: false,
			clase: "btn btn-warning boton btn-sm",
			habilitar: false,
			imprimir: false
		},
		{
			orig: "btnsCajaGeneral",
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
			orig: "btnsCajaGeneral",
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
			imprimir: false
		},
		];

		setTimeout(() => {
			this.getPermisions();
		}, 10);
	}

	getPermisions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fConsultaCaja,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.toastr.info("Usuario no tiene permiso para ver Consultas Caja General.");
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
			} else {
				this.getUsuarios();
				this.fillCatalog();
				this.nombreCajaBank();
				this.getCajaReport();
				this.SumaValor();
				let num = 0;
				this.totalenvio = num.toFixed(2);
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	fillCatalog() {
		let data = {
			params: "'FORMA COBRO CLIENTE'",
		};
		this.reporSrv.getCatalogs(data).subscribe((res) => {
			this.arrayPago = res["data"]["FORMA COBRO CLIENTE"];
		});
	}

	getCajaReport() {
		this.reporSrv.getCaja().subscribe((res) => {
			this.cajapunto = res["data"]; //cajas
		}, error => {
			this.lcargando.ctlSpinner(false);
		});
	}

	nombreCajaBank() {
		this.reporSrv.bankCaja().subscribe((res) => {
			this.arraybankCajaCab = res["data"];
		}, error => {
			this.lcargando.ctlSpinner(false);
		});
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "LIMPIAR":
				this.informaciondtlimpiar();
				break;
			case "EXCEL":
				$('#tableCajaGeneral').DataTable().button('.buttons-csv').trigger();
				break;
			case "PDF":
				$('#tableCajaGeneral').DataTable().button('.buttons-pdf').trigger();
				break;
			case "IMPRIMIR":
				$('#tableCajaGeneral').DataTable().button('.buttons-print').trigger();
				break;
		}
	}

	getUsuarios() {
		this.reporSrv.getUsuario().subscribe(res => {
			this.arrayUsers = res['data'];
			this.getSucursales();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getSucursales() {
		this.reporSrv.getSucursales().subscribe(res => {
			this.arraySucursales = res['data'];
			this.getReportsVentados();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getReportsVentados() {
		this.dtOptions = {
			pagingType: 'full_numbers',
			pageLength: 10,
			search: true,
			paging: true,
			dom: "lfrtip",
			order: [[2, "desc"]],
			scrollY: "200px",
            scrollCollapse: true,
			buttons: [{
				extend: "csv",
				footer: true,
				title: "Reporte",
				filename: "reportes",
			},
			{
				extend: "print",
				footer: true,
				title: "Reporte",
				filename: "report print",
			},
			{
				extend: "pdf",
				footer: true,
				title: "Reporte",
				filename: "Reporte Pdf",
			},
			],
			language: {
				url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
			},
		};
		let data = {
			dateFrom: moment(this.fromDatePicker).format("YYYY-MM-DD"),
			dateTo: moment(this.toDatePicker).format("YYYY-MM-DD"),
			caja: this.caja == 0 ? 0 : this.caja,
			f_pago: this.FormaPago == 0 ? 0 : this.FormaPago,
			user: this.user == 0 ? 0 : this.user,
			fk_sucursal: this.sucursal == 0 ? 0 : this.sucursal,
		};
		this.reporSrv.getValorConsultar(data).subscribe(res => {
			this.processingQuotes = true;
			this.lcargando.ctlSpinner(false);
			this.datoTabla = res["data"];
			this.totalForma = parseFloat('0.00');
			this.datoTabla.forEach(element => {
				this.totalForma = parseFloat(this.totalForma) + parseFloat(element['valor']);
			});
			setTimeout(() => {
				this.dtTrigger.next(null);
			}, 50);
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.processingQuotes = true;
			setTimeout(() => {
				this.dtTrigger.next(null);
			}, 50);
			this.toastr.info(error.error.message);
		});
	}



	rerender(): void {
		this.lcargando.ctlSpinner(true);
		this.processingQuotes = false;
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this.getReportsVentados();
		});
	}

	cajaReporte(evt) {
		if (evt !== 0) {
			this.caja = evt;
			this.rerender();
		} else {
			/* this.informaciondtlimpiar(); */
			this.rerender();
		}
	}

	userFilterSucursal(evt){
		if (evt !== 0) {
			this.sucursal = evt;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	formaPago(evt) {
		if (this.FormaPago != 0) {
			this.FormaPago = evt;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	userFilter(evt) {
		if (this.user != 0) {
			this.user = evt;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	informaciondtlimpiar() {
		let num = 0;
		this.fromDatePicker = new Date(
			this.viewDate.getFullYear(),
			this.viewDate.getMonth(),
			1
		);
		this.toDatePicker = new Date();
		this.caja = 0;
		this.FormaPago = 0;
		this.totalenvio = num.toFixed(2);
		this.rerender();
	}

	SumaValor() {
		var total = 0;
		for (let i = 0; i < this.datoTabla.length; i++) {
			if (isNaN(parseFloat(this.datoTabla[i]["valor"]))) {
				total += 0;
			} else {
				total += parseFloat(this.datoTabla[i]["valor"]);
			}
			this.totalValor = total;
			this.totalenvio = parseFloat(this.totalValor).toFixed(2);
		}
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

}
