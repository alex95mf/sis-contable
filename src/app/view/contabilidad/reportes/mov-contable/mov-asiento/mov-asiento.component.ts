
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import * as moment from "moment";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { MovContableService } from "../mov-contable.service";
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovAsientoDocumentoComponent } from '../mov-asiento-documento/mov-asiento-documento.component';
import { Console } from 'console';
@Component({
standalone: false,
  selector: 'app-mov-asiento',
  templateUrl: './mov-asiento.component.html',
  styleUrls: ['./mov-asiento.component.scss']
})export class MovAsientoComponent implements OnInit {
	@Input() dts: any;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	presentDt: any = false;
	processing: any = false;
	processingtwo: any = false;
	dtConsultaAsiento: any;
	dataUser: any;
	locality: any;
	arrayAsiento: Array < any > = [];
	arrayTable: Array < any > = [];
	arrayCab: Array < any > = [];
	totalRegistro: any;
	fecha: any;
	estado: any;
	documento: any;
	concepto: any;
	idAsiento: any;
	dtDocumento: any;

	vmButtons: any = [];

	dataTotal: any = {
		Haber: 0,
		Debe: 0
	};

	constructor(private toastr: ToastrService,
		private router: Router,
		public activeModal: NgbActiveModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private reportesSrv: MovContableService,
		private modalService: NgbModal, ) {}

	ngOnInit(): void {


		this.vmButtons = [
			{ orig: "btnMovAst", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false}
		];

		if (this.dts) {
			this.reportesSrv.getDetailsMovs().subscribe(res => {
				this.presentDt = true;
				this.processing = true;
				this.arrayAsiento = res["data"].filter((e) => e.fk_cont_mov_cab == this.dts.fk_cont_mov_cab);
				this.arrayTable = this.arrayAsiento;
				this.CalculoTotal();
			});
			this.reportesSrv.getMovientoCabData().subscribe(res => {
				let dataMovCab = res["data"].find((e) => e.id == this.dts.fk_cont_mov_cab);
				this.arrayCab = dataMovCab;
				this.idAsiento = this.arrayCab["id"].toString().padStart(10, '0');
				this.fecha =  this.arrayCab["fecha"];
				this.estado = (this.arrayCab["estado"] == '1') ? 'Activo' : 'Anulado';	
				this.documento = this.arrayCab["codigo"] + '-' + (this.arrayCab["num_doc"].length == "1" ? this.arrayCab["num_doc"].toString().padStart(10, '0') : this.arrayCab["num_doc"]);
				this.concepto =  this.arrayCab["concepto"];
			});
		}else{
		this.closeModal();	
		}
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		case "CERRAR": this.closeModal(); break;
		}
	}

	closeModal() {
		this.activeModal.dismiss();
	}

	CalculoTotal() {
		var TotalDebe = 0;
		var TotalHaber = 0;

		for (let i = 0; i < this.arrayTable.length; i++) {
			TotalDebe += parseFloat(this.arrayTable[i]["valor_deb"]);
			TotalHaber += parseFloat(this.arrayTable[i]["valor_cre"]);
		}
			this.dataTotal.Debe = TotalDebe;
			this.dataTotal.Haber = TotalHaber;
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

	viewDocument(dts) {
		const modalInvoice = this.modalService.open(MovAsientoDocumentoComponent, {
			size: "xl",
			backdrop: 'static',
			windowClass: 'viewer-content-general'
		});
		modalInvoice.componentInstance.dts = dts;
	}
}