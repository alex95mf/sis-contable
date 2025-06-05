import { Component, OnInit, OnDestroy, ViewChild, NgZone  } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "moment/locale/es";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ConsultaEstadoClienteService } from "./consulta-estado-cliente.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import {ModalConsultaClienteComponent} from "./modal-consulta-cliente/modal-consulta-cliente.component";
import { Socket } from "../../../../services/socket.service";
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-consulta-estado-cliente',
  templateUrl: './consulta-estado-cliente.component.html',
  styleUrls: ['./consulta-estado-cliente.component.scss']
})
export class ConsultaEstadoClienteComponent implements  OnInit {

	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
	  /* datatable */
/* 	  dtOptions: any = {}; */
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	 dtOptions: any = {};
	dtTrigger = new Subject();
	presentDt: any = false;
	infomestadoData: Array<any> = [];
	processing: any = false;
	processingtwo: any = false;
	locality: any;
	arrayFilt: Array <any> = [];
	arrayProveedor:Array <any> = [];
	arrayCompra: Array <any> = [];
	arrayCliente: Array < any > = [];
	viewDate: Date = new Date();
	fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	toDatePicker: Date = new Date();
	cliente: any = 0;
	permisions: any;
	dataUser: any;
	vmButtons: any = [];
	dataInformacion: any = {};
	id_datacliente: any;
	dataCount: any;
	datConsulta: any;
	vmButtonsInf: any = [];
	contDatatable:any = 0;

	constructor(private toastr: ToastrService,
		private router: Router,
		private reportesSrv: ConsultaEstadoClienteService,
		private modalService: NgbModal,
		private commonServices: CommonService,
		private commonVarSrvice: CommonVarService,
		private socket: Socket,
		private confirmationDialogService: ConfirmationDialogService) {}

	/*inicio*/
	ngOnInit(): void {
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		this.vmButtons = [
			{ orig: "btnEstadoCliente", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnEstadoCliente", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
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
			codigo: myVarGlobals.fREstadoCuentaCliente,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.processing = false;
				this.toastr.info("Usuario no tiene permiso para Consultar el Estado de cuenta de Cliente.");
				this.vmButtons = [];
				this.datConsulta = [];
				this.lcargando.ctlSpinner(false);
			} else {

				this.processing = true;
				this.getClientes();
			}
		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "CONSULTAR":
				this.consultarData();
				break;
			case "CANCELAR":
				this.limpiar();
				break;
		}
	}

	getClientes() {
		this.reportesSrv.getCliente().subscribe(res => {
			this.lcargando.ctlSpinner(false);
			this.arrayCliente = res['data'];
		}, error=>{
			this.lcargando.ctlSpinner(false);
		});
	}

	metodoGlobalsInf(evento: any) {
		this.processingtwo = true;
		switch (evento.items.boton.texto) {
			case "REGRESAR CONSULTA":
				this.limpiar();
				break;
				case "IMPRIMIR":
				this.savePrint();
				break;
		}
	}

	consultarData() {
		if (this.permisions.consultar == "0") {
			this.toastr.info("Usuario no permiso para Consultar el Estado de Cuenta de Cliente");
		} else {
			this.vmButtonsInf = [
				{ orig: "btnEstadoClienteInf", paramAccion: "", boton: { icon: "fas fa-share-square", texto: "REGRESAR CONSULTA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
				{ orig: "btnEstadoClienteInf", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true },
				];
			this.ConsultarTableDoc();
			 }
	 }

	  ConsultarTableDoc() {
		this.lcargando.ctlSpinner(true);
		if (this.cliente == 0) {
			this.lcargando.ctlSpinner(false);
			this.toastr.info("Seleccione el cliente");
			this.processingtwo = false;
		} else {
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			cliente: this.cliente == 0 ? null : this.cliente,
		}
		this.reportesSrv.getAllConsulta(data).subscribe(res => {
			if (res['data'].length > 0) {
				this.lcargando.ctlSpinner(false);
				this.processingtwo = true;
				this.processing = false;
				this.presentDt = true;
				this.datConsulta = res['data'];
				if (this.datConsulta.length > 0) {
					this.vmButtonsInf[1].habilitar = false;
				}else{
					this.vmButtonsInf[1].habilitar = true;
				}
				this.CalculoTotal();
				this.dataInformacionConsult();
				this.getultimaCompra();
					} else {
						this.lcargando.ctlSpinner(false);
						this.processing = true;
						this.processingtwo = false;
						this.datConsulta = res['data'];
						this.toastr.info("Facturas no existente para este Cliente");
					}
		  }, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		  });
	  }
	}

	getultimaCompra() {
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			cliente: this.cliente == 0 ? null : this.cliente,
		}
    this.reportesSrv.getUltimo(data).subscribe(res => {
			this.arrayCompra = res['data'];
			this.dataInformacion.ultimaComFecha = this.arrayCompra[0].fecha_inicio;
			this.dataInformacion.ultimaComValor = this.formatNumber(this.arrayCompra[0].monto_total);
		}, )
	}

	dataInformacionConsult(){
		this.id_datacliente = this.cliente;
		this.reportesSrv.getCliente().subscribe(res => {
			let filt = res['data'].find((e) => e.id_cliente == this.id_datacliente);
			this.dataInformacion.ruc = filt.num_documento;
			this.dataInformacion.clienteDesde = filt.fecha;
			this.dataInformacion.cliente = filt.nombre_comercial_cli;
			this.dataInformacion.ejecutivo = filt.nombre;
			this.dataInformacion.plazoCredito = filt.plazo_credito;
			this.dataInformacion.observacion = filt.observacion;
			this.dataInformacion.cupo = this.formatNumber(filt.cupo_credito);
			this.dataInformacion.utilizado = this.formatNumber(filt.valor_credito);
			this.dataInformacion.disponible = this.formatNumber(filt.saldo_credito);
			if(this.dataInformacion.ruc != undefined || this.dataInformacion.ruc != null){
				let datas = {
					ruc:  this.dataInformacion.ruc,
				}
				this.reportesSrv.existProveedors(datas).subscribe(res => {
					this.arrayProveedor = res['data'];
					if(this.arrayProveedor.length > 0){
							this.dataInformacion.existProveedor = 'SI';
							document.getElementById("iddataProveedor").style.backgroundColor = "#46B21A ";
							this.dataInformacion.IDProveedor = this.arrayProveedor[0].id_proveedor.toString().padStart(10, '0');
					}else{
						this.dataInformacion.existProveedor = 'NO';
						this.dataInformacion.IDProveedor = "NINGUNO";
						document.getElementById("iddataProveedor").style.backgroundColor = "#FF3333";
					}
				}, );
			}
		}, );
	}

	CalculoTotal() {
		var total = 0;
		for (let i = 0; i < this.datConsulta.length; i++) {
			this.dataInformacion.comprasR = this.datConsulta.length;
			total += parseFloat(this.datConsulta[i]["monto_total"]);
		}
		this.dataInformacion.montoAcumulado = this.formatNumber(total);
	}

	savePrint() {
		if (this.permisions.imprimir == "0") {
			this.toastr.info("Usuario no tiene Permiso para imprimir");
		} else {
			let data = {
				ip: this.commonServices.getIpAddress(),
				accion: "Registro de estado de Cuenta del Cliente",
				id_controlador: myVarGlobals.fREstadoCuentaCliente
			}
			this.reportesSrv.printData(data).subscribe(res => {}, error => {
				this.toastr.info(error.error.mesagge);
			});
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

    limpiar(){
		this.cliente = 0;
		this.fromDatePicker =  new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
		this.toDatePicker = new Date();
		this.processing = true;
		this.processingtwo = false;
		this.presentDt = false;
	}

	obtenerCliente(evet){
		this.cliente = evet;
    }


	showCxcCi(dt) {
		const dialogRef = this.confirmationDialogService.openDialogMat(ModalConsultaClienteComponent, {
		  width: '1000px',
		  height: 'auto',
		});
		dialogRef.componentInstance.dt = dt;
	  }

}
