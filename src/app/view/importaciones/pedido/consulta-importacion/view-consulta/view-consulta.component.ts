
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { ConsultaImportacionService } from "../consulta-importacion.service";
@Component({
standalone: false,
	selector: 'app-view-consulta',
	templateUrl: './view-consulta.component.html',
	styleUrls: ['./view-consulta.component.scss']
})
export class ViewConsultaComponent implements OnInit {

	@Input() dts: any;
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	infoData: any;
	processing: any = false;
	processingtwo: any = false;
	dataUser: any;
	data: any;
	locality: any;
	dataEnvio: any = {};
	dtimportPedido: Array < any > = [];
	arrayDtImpPedido: Array < any > = [];
	constructor(private toastr: ToastrService,
		private router: Router,
		public activeModal: NgbActiveModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private reportesSrv: ConsultaImportacionService, ) {}

	ngOnInit(): void {
		this.processing = true;
		this.data = this.dts;
		this.getDT();
	}

	closeModal() {
		this.activeModal.dismiss();
	}

	getDT() {
		this.reportesSrv.getPedidosDt().subscribe(res => {
			this.arrayDtImpPedido = res['data'];
			this.TablaDt();
		}, error => {
			this.toastr.info(error.error.message);
		})
	}

	TablaDt() {
		var totalPeso = 0;
		var totalVolumen = 0;
		var totalPrecio = 0;
		let modalDoc = this.arrayDtImpPedido.filter((e) => e.fk_pedido == this.data.id);
		if (modalDoc != undefined) {
			this.dtimportPedido = modalDoc;
			for (let i = 0; i < this.dtimportPedido.length; i++) {
				totalPeso += this.dtimportPedido[i]["pesoKg"];
				totalVolumen += this.dtimportPedido[i]["volumenm3"];
				totalPrecio += parseFloat(this.dtimportPedido[i]["precio"]);
			}
			this.dataEnvio.peso = totalPeso;
			this.dataEnvio.volumen = totalVolumen;
			this.dataEnvio.precio = totalPrecio
			this.dataEnvio.Pedido = this.data.num_doc_compra;
			this.dataEnvio.FechaPedido = this.data.fecha_ped
			this.dataEnvio.FechaLlegada = this.data.fecha_lleg;
			this.dataEnvio.Origen = this.data.nom_pais;
			this.dataEnvio.Estado = this.data.estado;
			this.dataEnvio.Proveedor = this.data.razon_social;
			this.dataEnvio.FormaPago = this.data.forma_pago;
			this.dataEnvio.Icoterm = this.data.value_espaniol;
			this.dataEnvio.total = this.data.total_pedido;
			this.dataEnvio.gasto = this.data.total_gasto;
			this.dataEnvio.tb = this.data.total;
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