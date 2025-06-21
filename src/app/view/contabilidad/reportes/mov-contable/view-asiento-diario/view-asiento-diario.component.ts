
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import moment from "moment";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { MovContableService } from "../mov-contable.service";
@Component({
standalone: false,
	selector: 'app-view-asiento-diario',
	templateUrl: './view-asiento-diario.component.html',
	styleUrls: ['./view-asiento-diario.component.scss']
})
export class ViewAsientoDiarioComponent implements OnInit {
	@Input() dt: any;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	processing: any = false;
	processingtwo: any = false;
	dataUser: any;
	presentDt: any = false;
	dtConsultaAsiento: any;
	locality: any;
	id: any = 0;
	estado: any = "";
	tipo: any = 0;
	numero: any = 0;
	montoDesde: any;
	montoHasta: any;
	totalRegistro: any;
	viewDate: Date = new Date();
	fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	toDatePicker: Date = new Date();
	arrayCabMov: Array < any > = [];
	arrayTipo: Array < any > = []; /* dtConsultaAsiento  */
	arrayCab: Array < any > = [];
	arrayId: Array < any > = [];
	arrayEstado: Array < any > = [{
			id: "",
			name: "Seleccione Estado"
		},
		{
			id: 1,
			name: "Activo"
		},
		{
			id: 0,
			name: "Anulado"
		},
	];
	constructor(private toastr: ToastrService,
		private router: Router,
		public activeModal: NgbActiveModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private reportesSrv: MovContableService, ) {}

	ngOnInit(): void {
		this.processing = true;
		this.getDocumentsDetails();
		this.getMovientoCabs();
		this.getDetailsMove();
		console.log(this.montoHasta)
		console.log(this.montoDesde)
	}

	closeModal() {
		this.activeModal.dismiss();
	}

	getMovientoCabs() {
		this.reportesSrv.getMovientoCabData().subscribe(res => {
			this.arrayCabMov = res["data"];
			this.arrayId = res["data"];
		})
	}

	getDocumentsDetails() {
		this.reportesSrv.getDocumentData().subscribe(res => {
			this.arrayTipo = res["data"];
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

	filterId(data) {
		if (data != 0) {
			this.id = data;
			this.getDetailsMove();
		}
	}

	filterTipo(data) {
		if (data != 0) {
			let filt = this.arrayCabMov.filter((e) => e.fk_tip_doc == data);
			this.arrayCab = filt;
			this.tipo = data;
			this.getDetailsMove();
		}
	}


	filterNumero(data) {
		if (data != 0) {
			this.numero = data;
			this.getDetailsMove();
		}
	}

	filterEstado(data) {
		if (data != "") {
			this.estado = data;
			this.getDetailsMove();
		}
	}


	Desdemonto(data) {
		if (data != 0) {
			this.montoDesde = data;
			this.getDetailsMove();
		}
	}

	Hastamonto(data) {
		if (data != 0) {
			this.montoHasta = data;
			this.getDetailsMove();
		}
	}

	getDetailsMove() {
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			id: this.id == 0 ? null : this.id,
			estado: this.estado == "" ? null : this.estado,
			tipo: this.tipo == 0 ? null : this.tipo,
			numero: this.numero == 0 ? null : this.numero,
			montoDesde: this.montoDesde == undefined ? null : this.montoDesde,
			montoHasta: this.montoHasta == undefined ? null : this.montoHasta,
		}

		this.reportesSrv.searchMovientoCabezera(data).subscribe(res => {
			this.presentDt = true;
			this.processing = true;
			this.dtConsultaAsiento = res['data'];
			this.totalRegistro = this.dtConsultaAsiento.length;

		}, error => {
			console.log(error)
		});
	}

}