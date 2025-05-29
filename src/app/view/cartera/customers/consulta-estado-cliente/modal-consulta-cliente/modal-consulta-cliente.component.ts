import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { ConsultaEstadoClienteService } from '../consulta-estado-cliente.service';
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { MatDialogRef } from '@angular/material/dialog';
import { join } from '@amcharts/amcharts4/core';
@Component({
standalone: false,
	selector: 'app-modal-consulta-cliente',
	templateUrl: './modal-consulta-cliente.component.html',
	styleUrls: ['./modal-consulta-cliente.component.scss']
})
export class ModalConsultaClienteComponent implements OnInit {
	mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
	arrayView: Array < any > = [];
	datConsulta: any;
	cliente: any = 0;
	viewDate: Date = new Date();
	fromDatePicker: Date = new Date();
	toDatePicker: Date = new Date();
	permisions: any;
	dataUser: any;
	processing: any = false;
	@Input() dt: any;
	vmButtons: any = [];
	arrayviewTable: Array <any> = [];
	arrayIngreso: Array < any > = [];
	dtData: Array < any > = [];
	dataEnvio: any = {
		razon_social: "",
		ruc: "",
		fecha: ""
	};
	prueba:any;
	constructor(public activeModal: NgbActiveModal,
		private reportesSrv: ConsultaEstadoClienteService,
		private commonService: CommonService,
		private commonVarSrvice: CommonVarService,
		private toastr: ToastrService,
		private router: Router,
		private dialogRef: MatDialogRef <ModalConsultaClienteComponent>
	) {}

	ngOnInit(): void {
		this.vmButtons = [
			{ orig: "btnEstCuentac", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
		  ];

		setTimeout(() => {
			this.getPermisions();
		}, 10);

	}

    metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		  case "CERRAR":
			this.dialogRef.close(false);
			break;
		}
	  }

	  getPermisions() {
		this.lcargando.ctlSpinner(true);
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fREstadoCuentaCliente,
			id_rol: id_rol
		}
		this.commonService.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.toastr.info("Usuario no tiene permiso para Ver Más Información del Estado de cuenta de Cliente.");
				this.lcargando.ctlSpinner(false);
			}else{
				this.getIngreso();
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
		})
	}

	getIngreso() {
        this.reportesSrv.getReportComprobantesI().subscribe(res => {
			this.lcargando.ctlSpinner(false);
            this.arrayIngreso = res['data'];
			console.log(this.arrayIngreso)
			this.getViewConsulta();
        }, error => {
			this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
        })
    }

	getViewConsulta() {
		this.reportesSrv.viewCXCcliente().subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayView = res['data'];
			this.arrayviewTable = this.arrayView.filter((e) => e.doc_ref_num == this.dt.doc_num);
			this.dtData = this.arrayIngreso.filter((e) => e.num_doc_adq == this.dt.doc_num);
			for (let j = 0; j < this.dtData.length; j++) {
				 for (let i = 0; i < this.arrayviewTable.length; i++) {
					this.arrayviewTable[i]["id"] =	this.dtData[j]["id"];
					this.arrayviewTable[i]["name_bank"] =	this.dtData[j]["name_bank"];
					this.arrayviewTable[i]["metodo_pago"] =	this.dtData[j]["metodo_pago"];
					this.arrayviewTable[i]["num_tx"] =	this.dtData[j]["num_tx"];
					} 
				} 
			this.informaCabezera();
		}, error=>{
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		});
	}

	informaCabezera(){
		this.dataEnvio.razon_social = this.dt.razon_social;
		this.dataEnvio.ruc = this.dt.num_documento
		this.dataEnvio.fecha = this.dt.fecha
	}

}
