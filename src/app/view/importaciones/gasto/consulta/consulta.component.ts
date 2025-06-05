import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ConsultaGService } from "./consulta.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ViewConsultaGastoComponent } from './view-consulta-gasto/view-consulta-gasto.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
declare const $: any;
@Component({
standalone: false,
selector: 'app-consulta',
templateUrl: './consulta.component.html',
styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	infoData: any;
    permisions: any;
	dataUser: any;
    viewDate: Date = new Date();
	fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	toDatePicker: Date = new Date();
	proveedor: any = 0;
	estado: any = 0;
	pedido: any = 0;
	grupo:any = 0;
	ruc: any;
	documento :any = 0;
	numero :any = 0;
	aplica: any = 0;
	disNumero: any = true;
	arrayRubros: Array<any> = [];
	vmButtons: any = [];
	dataDT: Array<any> = [];
	arrayProveedor: Array<any> = [];
	arrayPedido: Array<any> = [];
	arrayAplica: Array<any> = [];
	arraynumDoc: Array<any> = [];
	arrayDocumento: Array<any> = [];
	arrayEstado: Array<any> = [{
	estado: "Pendiente"
	},
	{
	estado: "Aprobado"
	},
	{
	estado: "Facturado"
	},
	{estado: "Anulado"}
		];
    constructor(private toastr: ToastrService,
	private router: Router,
	private reportesSrv: ConsultaGService,
	private modalService: NgbModal,
	private commonServices: CommonService,
	private commonVarSrv: CommonVarService,
    private confirmationDialogService: ConfirmationDialogService) { }

	ngOnInit(): void {
	this.vmButtons = [
				{ orig: "btnsrepGastos", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
				{ orig: "btnsrepGastos", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
				{ orig: "btnsrepGastos", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
				{ orig: "btnsrepGastos", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
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
			codigo: myVarGlobals.fRImpGastos,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.vmButtons = [];
				this.lcargando.ctlSpinner(false);
				this.toastr.info("Usuario no tiene permiso para Consultar Gastos.");
				this.router.navigateByUrl('dashboard');
			} else {
				this.getProveedores();
				this.getTableReport();
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
				$('#tableImGastos').DataTable().button('.buttons-csv').trigger();
				break;
			case "PDF":
				$('#tableImGastos').DataTable().button('.buttons-pdf').trigger();
				break;
			case "IMPRIMIR":
				$('#tableImGastos').DataTable().button('.buttons-print').trigger();
				break;
		}
	}

	getProveedores() {
		this.reportesSrv.getProveedores().subscribe(res => {
			this.arrayProveedor = res['data'];
			this.getTipoPedidos();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getTipoPedidos() {
		this.reportesSrv.getTipoGastos().subscribe(res => {
			this.arrayRubros = res['data'];
			this.getDocument();
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	getDocument() {
		let data = {
			params: "'C'"
		}
		this.reportesSrv.getTypeDocument(data).subscribe(res => {
			this.arrayDocumento = res['data']['C'];
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message)
		})
	}

	getTableReport() {
		this.dtOptions = {
			pagingType: "full_numbers",
			pageLength: 10,
			search: true,
			paging: true,
/* 			order: [
				[0, "desc"]
			], */
			buttons: [{
					extend: "csv",
					footer: true,
                    charset: 'UTF-8',
                    bom: true,
					title: "Reporte",
					filename: "reportes",
					exportOptions: {
						columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
						columns: [0, 1, 2, 3, 4, 5, 6, 7],
					}
				},
				{
					extend: "pdf",
					footer: true,
					title: "Reporte",
					filename: "Reporte",
					exportOptions: {
						columns: [0, 1, 2, 3, 4, 5, 6, 7],
					}
				},
			],
			language: {
				url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
			},
		};
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			documento: this.documento == 0 ? null : this.documento,
			numero: this.numero == 0 ? null : this.numero,
			proveedor: this.proveedor == 0 ? null : this.proveedor,
			grupo: this.grupo == 0 ? null : this.grupo,
			aplica: this.aplica == 0 ? null : this.aplica,
			estado: this.estado == 0 ? null : this.estado,
		}
		this.lcargando.ctlSpinner(true);
		this.reportesSrv.getImportacionGastos(data).subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.validaDt = true;
			this.infoData = res['data'];
			this.dataDT = res['data'];
			if (this.infoData.length > 0) {
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
		this.dtElement.dtInstance.then((dtInstance: any) => {
			dtInstance.destroy();
			this.getTableReport();
		});
	}

	setProveedor(evt) {
		if (evt != 0) {
			this.proveedor = evt;
			this.ruc = this.arrayProveedor.filter(e => e.id_proveedor == evt)[0]['num_documento'];
			this.rerender();
		} else {
			this.ruc = undefined;
			this.rerender();
		}
	}

	filterDocumento(data) {
		if (data != 0) {
			let filt = this.dataDT.filter(e => e.tip_doc_gasto == data);
			this.arraynumDoc = filt;
			this.disNumero = false;
			this.documento = data
			this.rerender();
		} else {
			this.rerender();
		}
	}


	filterNumero(data) {
		if (data != 0) {
			this.numero = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filterEstado(data) {
		if (data != 0) {
			this.aplica = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filterTipoGasto(data) {
		if (data != 0) {
			this.grupo = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	filteraplica(data) {
		if (data != 0) {
			this.aplica = data;
			this.rerender();
		} else {
			this.rerender();
		}
	}

	informaciondtlimpiar() {
		this.ruc = undefined;
		this.disNumero = true;
		this.documento = 0;
		this.numero = 0;
		this.proveedor = 0;
		this.grupo = 0;
		this.estado = 0;
		this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
		this.toDatePicker = new Date();
		/* this.rerender(); */
	}

	showDtGasto(dt) {
		const dialogRef = this.confirmationDialogService.openDialogMat(ViewConsultaGastoComponent, {
			width: '1000px',
			height: 'auto',
		});
		dialogRef.componentInstance.dt = dt;
	}

}
