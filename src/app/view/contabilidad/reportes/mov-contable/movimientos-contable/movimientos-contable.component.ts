import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as myVarGlobals from '../../../../../global'; 
import { MovimientosContablesService } from './movimientos-contables.service'
import * as moment from "moment";
import { CommonService } from '../../../../../services/commonServices';
@Component({
	selector: 'app-movimientos-contable',
	templateUrl: './movimientos-contable.component.html',
	styleUrls: ['./movimientos-contable.component.scss']
})
export class MovimientosContableComponent implements OnInit {
	validaDt: any = false;
	infoData: any;
	processing: any = false;
	processingtwo: any = false;
	permisions: any;
	dataUser: any;
	viewDate: Date = new Date();
	fromPrimer: Date = new Date(1, 1, this.viewDate.getFullYear());
	fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	toDatePicker: Date = new Date();
	codigo: any = 0;
	nombre: any = 0;
	tipo: any = 0;
	numero: any = 0;
	locality: any;
	actual: any = 0;
	anterior: any = 0;
	totalValor: any;
	dataSactual: any
	dataSanterior: any;
	numData: Array < any > = [];
	arrayCodigo: Array < any > = [];
	arrayNombre: Array < any > = [];
	arrayTipo: Array < any > = [];
	arrayCab: Array < any > = [];
	dataAnterior: any;
	prueba: any;
	dataTotal: any = {
		countRegistros: 0,
		Debe: 0,
		Haber: 0,
		Saldo: 0
	};
	formatTotal: any;
	constructor(private toastr: ToastrService,
		private router: Router,
		private reportesSrv: MovimientosContablesService,
		private commonServices: CommonService) {}

	ngOnInit(): void {
		this.getPermisions();
	}

	getPermisions() {
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fRImportaciones,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
				this.toastr.info("Usuario no tiene permiso para Consultar Movimientos Contables.");
				this.router.navigateByUrl('dashboard');
			} else {
				this.processing = true;
				this.getAccountsDetails();
			}
		}, error => {
			this.toastr.info(error.error.message);
		})
	}

	getAccountsDetails() {
		let data = {
			company_id: this.dataUser.id_empresa
		};
		this.reportesSrv.getAccountsByDetails(data).subscribe(res => {
			this.arrayCodigo = res["data"];
			this.arrayNombre = res["data"];
			this.getDocumentsDetails();
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

	filterCodigo(data) {
		if (data != 0) {
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
		if (data != 0) {
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
			this.tipo = data;
			let datas = {
				codigo: this.tipo
			};
			this.reportesSrv.getmovCab(datas).subscribe(res => {
				this.arrayCab = res["data"];
			});
			this.getSaldoAnterior();
			this.getDetailsMove();
		} else {
			this.limpiarMov();
		}
	}

	filterNumero(data) {
		if (data != 0) {
			this.numero = data;
			this.getSaldoAnterior();
			this.getDetailsMove();
		} else {
			this.limpiarMov();
		}
	}

	FromOrToChange(data) {
		this.getSaldoAnterior();
		this.getDetailsMove();
	}

	getDetailsMove() {
		let data = {
			dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
			dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
			codigo: this.codigo == 0 ? null : this.codigo,
			nombre: this.nombre == 0 ? null : this.nombre,
			tipo: this.tipo == 0 ? null : this.tipo,
			numero: this.numero == 0 ? null : this.numero,
		}
		this.reportesSrv.getMovimientoContable(data).subscribe(res => {
			this.validaDt = true;
			this.processing = true;
			this.infoData = res['data'];
			if (this.infoData.length > 0) {
				this.CalculoTotal();
				this.getSaldoAnterior();
			} else {
				this.dataTotal = {
					countRegistros: 0,
					Debe: 0,
					Haber: 0,
					Saldo: 0
				};
			}
		}, error => {
			console.log(error)
		});
	}

	limpiarMov() {
		this.infoData = [];
		this.codigo = 0;
		this.nombre = 0;
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
	}

	getSaldoAnterior() {
		let data = {
			cuenta: this.codigo,
			desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
		}
		this.reportesSrv.getanterior(data).subscribe(res => {
			this.dataSanterior = res['data'];
			this.dataAnterior = res['data'][0].saldoAnterior;
			if (isNaN(parseFloat(this.dataAnterior))) {
				this.dataAnterior = 0;
				this.anterior = 0;
				let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.anterior);
				this.formatTotal = datainfo;
				this.actual = this.formatNumber(parseFloat(this.formatTotal));	
				
			  }else{
				this.anterior = this.formatNumber(res['data'][0].saldoAnterior); 
				let datainfo = parseFloat(this.dataTotal.Saldo) + parseFloat(this.dataAnterior);
				this.formatTotal = datainfo;
				this.actual = this.formatNumber(parseFloat(this.formatTotal));	 
			  }
		}, error => {
			console.log(error)
		});
	}

	CalculoTotal() {
		var TotalDebe = 0;
		var TotalHaber = 0;
		var total = 0;
		for (let i = 0; i < this.infoData.length; i++) {
			console.log(this.infoData[i]["clase"]);
		   if(this.infoData[i]["clase"] == 'DEUDORA'){
			this.dataTotal.countRegistros = this.infoData.length;
			TotalDebe += parseFloat(this.infoData[i]["valor_deb"]);
			TotalHaber += parseFloat(this.infoData[i]["valor_cre"]);
			this.totalValor = parseFloat(this.infoData[i]["valor_deb"]) - parseFloat(this.infoData[i]["valor_cre"]);
			total += parseFloat(this.totalValor);
			this.infoData[i]["saldo"] = total;
		   }else{
			this.dataTotal.countRegistros = this.infoData.length;
			TotalDebe += parseFloat(this.infoData[i]["valor_deb"]);
			TotalHaber += parseFloat(this.infoData[i]["valor_cre"]);
			this.totalValor = parseFloat(this.infoData[i]["valor_cre"]) - parseFloat(this.infoData[i]["valor_deb"]);
			total += parseFloat(this.totalValor);
			this.infoData[i]["saldo"] = total;
		   }
		}
			this.dataTotal.Saldo = total;
			this.dataTotal.Debe = TotalDebe;
			this.dataTotal.Haber = TotalHaber;
	 }
}
