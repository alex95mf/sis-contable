import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ConsultaImportacionService } from "./consulta-importacion.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { ViewConsultaComponent } from './view-consulta/view-consulta.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
	selector: 'app-consulta-importacion',
	templateUrl: './consulta-importacion.component.html',
	styleUrls: ['./consulta-importacion.component.scss']
})
export class ConsultaImportacionComponent implements OnInit {
	mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	infoData: any;
	processing: any = false;
	processingtwo: boolean = false;
	permisions: any;
	dataUser: any;
	locality: any;
	pedidonum: any = 0;
	origen: any = 0;
	estado: any = 0;
	proveedor: any = 0;
	viewDate: Date = new Date();
	fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	toDatePicker: Date = new Date();
	/* fromDatePicker: Date = new Date();
	toDatePicker: Date = new Date(); */
	arrayPedido: Array<any> = [];
	arrayProveedor: Array<any> = [];
	arrayOrigen: Array<any> = [];
	vmButtons: any = [];
	arrayEstado: Array<any> = [{
		estado: "Pendiente"
	},
	{
		estado: "Aprobado"
	},
	{
		estado: "Facturado"
	},
	];

	constructor(private toastr: ToastrService,
		private router: Router,
		private reportesSrv: ConsultaImportacionService,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService) { }

	ngOnInit(): void {
		this.vmButtons = [
			{ orig: "btnsImpPedidos", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnsImpPedidos", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnsImpPedidos", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnsImpPedidos", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
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
			codigo: myVarGlobals.fRImportaciones,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.lcargando.ctlSpinner(false);
				this.vmButtons = [];
				this.toastr.info("Usuario no tiene permiso para Consultar Importaciones.");
				this.router.navigateByUrl('dashboard');
				this.processing = false;
			} else {
				this.processing = true;
				this.getCurrencys();
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "CANCELAR":
				this.informaciondtlimpiar();
				break;
			case "EXCEL":
				$('#tableImPedido').DataTable().button('.buttons-excel').trigger();
				break;
			case "PDF":
				$('#tableImPedido').DataTable().button('.buttons-pdf').trigger();
				break;
			case "IMPRIMIR":
				$('#tableImPedido').DataTable().button('.buttons-print').trigger();
				break;
		}
	}

	getCurrencys() {
		this.reportesSrv.getCurrencys().subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayOrigen = res['data']
			this.getProveedores();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getProveedores() {
		this.reportesSrv.getProveedores().subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayProveedor = res['data'];
			this.getPedidos();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getPedidos() {
		this.reportesSrv.getNumPedidos().subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayPedido = res['data'];
			this.getTableReport();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getTableReport() {
		this.dtOptions = {
			pagingType: "full_numbers",
			pageLength: 10,
			search: true,
			paging: true,
			responsive: true,
			scrollY: "200px",
			scrollCollapse: true,
			dom: "frtip",
			buttons: [{
				extend: "excel",
				footer: true,
				title: "Reporte",
				filename: "reportes",
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
					format: {
						body: function (data, row, column, node) {
							return data.replace(/[,.]/g, function (m) {
								return m === ',' ? '.' : ',';
							});
						}
					}
				}
			},
			{
				extend: "print",
				footer: true,
				title: "Reporte",
				filename: "report print",
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				}
			},
			{
				extend: "pdf",
				footer: true,
				title: "Reporte",
				filename: "Reporte",
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				}
			},
			],
			language: {
			  url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
			},
		  };
		let data = {
			date: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateLlegada:  moment(this.toDatePicker).format('YYYY-MM-DD'),
		/* 	dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'), */
			pedido: this.pedidonum == 0 ? null : this.pedidonum,
			origen: this.origen == 0 ? null : this.origen,
			estado: this.estado == 0 ? null : this.estado,
			proveedor: this.proveedor == 0 ? null : this.proveedor,
		}
		this.lcargando.ctlSpinner(true);
		this.reportesSrv.getImportacionPedido(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.validaDt = true;
			this.infoData = res['data'];
			if (res["data"].length > 0) {
				this.vmButtons[1].habilitar = false;
				this.vmButtons[2].habilitar = false;
				this.vmButtons[3].habilitar = false;
			  } else {
				this.vmButtons[1].habilitar = true;
				this.vmButtons[2].habilitar = true;
				this.vmButtons[3].habilitar = true;
			  }
			this.lcargando.ctlSpinner(false);
			setTimeout(() => {
				this.dtTrigger.next(null);
			}, 50);
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.validaDt = true;
			setTimeout(() => {
				this.dtTrigger.next(null);
			}, 50);
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}

	rerender(): void {
		this.validaDt = false;
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this.getTableReport();
		});
	}

	informaciondtlimpiar() {
		this.proveedor = 0;
		this.origen = 0;
		this.pedidonum = 0;
		this.estado = 0;
		this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	    this.toDatePicker = new Date();
	}

	filterPedido(data) {
		if (this.pedidonum != 0) {
			this.pedidonum = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filterOrigen(data) {
		if (this.origen != 0) {
			this.origen = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filterEstado(data) {
		if (this.estado != 0) {
			this.estado = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filterProveedor(data) {
		if (this.proveedor != 0) {
			this.proveedor = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	showInformacion(dts) {
		const modalInvoice = this.modalService.open(ViewConsultaComponent, {
			size: "xl",
			backdrop: 'static',
			windowClass: 'viewer-content-general'
		});
		modalInvoice.componentInstance.dts = dts;
	}

	formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 4
		})
		params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
		return params;
	}


}
