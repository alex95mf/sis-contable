import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BalanceComprobacionService } from './balancecomprobacion.services'
import { Subject } from 'rxjs';
import { ExcelService } from '../../../../services/excel.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { environment } from 'src/environments/environment';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-balancecomprobacion',
  templateUrl: './balancecomprobacion.component.html',
  styleUrls: ['./balancecomprobacion.component.scss']
})
export class BalancecomprobacionComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtAccount: any = false;
  dataUser: any;
  permisions: any;
  dataAccount: any;
  nivelSeleccionado: any = 1;
  peridoSelecionado: any = "";
  claseSeleccionado: any = "";
  grupoSeleccionado: any = "";
  dataLength: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  totalDebito: any;
  totalCredito: any;
  sumaDebito: any;
  sumaCredito: any;
  btnPrint: any;
  excelData: any = [];
  groupAccount: any;
  locality: any;
  excelDataAux: any = [];
  processing:any = false;
  empresLogo: any;

  URL_API = environment.apiUrl

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(private commonService: CommonService, private toastr: ToastrService, private router: Router,
    private balanceService: BalanceComprobacionService, private excelService: ExcelService) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true}
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.empresLogo = this.dataUser.logoEmpresa;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fBalanceComprobacion,
      id_rol: id_rol
    }
    this.commonService.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
        if (this.permisions[0].ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Balance comprobación");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          if(this.permisions[0].imprimir == "0"){
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          }else{
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          }          
          
          this.getParametersFilter();
        }
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.rerender();
        break;
      case "EXCEL":
        this.btnExportar();
        break;
      case "IMPRIMIR":
        this.savePrint();
        break;
    }
  }

  getGrupoAccount() {
    this.balanceService.getGrupoAccount({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.groupAccount = res['data'];
      this.processing = true;
      this.getAccountData();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  lstNiveles:any = [];
  getParametersFilter() {
    this.balanceService.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.dataLength = res['data'];

      if(this.dataLength[0]){
        for (let index = 0; index < this.dataLength[0].niveles; index++) {
          this.lstNiveles.push(index+1);          
        }
      }

      this.getGrupoAccount();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  getAccountData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.balanceService.getAccounts({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDtAccount = true;
      this.dataAccount = [];
      res['data']['maping'].forEach(dt => {
        if(Number(dt.debito) != 0 || Number(dt.credito) != 0 || Number(dt.saldo_deudor) != 0 || Number(dt.saldo_acreedor) != 0){
          this.dataAccount.push(dt);
        }
      });
      this.totalDebito = res['data']['total_debito'];
      this.totalCredito = res['data']['total_credito'];
      this.sumaDebito = res['data']['total_saldo_deudor'];
      this.sumaCredito = res['data']['total_saldo_acreedor'];
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getDataAccountFilter();
      });
    }
  }

  getDataAccountFilter() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    let data = {
      nivel: (this.nivelSeleccionado == undefined) ? null : this.nivelSeleccionado,
      periodo: (this.peridoSelecionado == undefined) ? null : this.peridoSelecionado,
      clase: (this.claseSeleccionado == undefined) ? null : this.claseSeleccionado,
      grupo: (this.grupoSeleccionado == undefined) ? null : this.grupoSeleccionado,
      id_empresa: this.dataUser.id_empresa
    }
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.balanceService.getAccountsFilters(data).subscribe(res => {
      this.validaDtAccount = true;
      this.dataAccount = [];
      res['data']['maping'].forEach(dt => {
        if(Number(dt.debito) != 0 || Number(dt.credito) != 0 || Number(dt.saldo_deudor) != 0 || Number(dt.saldo_acreedor) != 0){
          this.dataAccount.push(dt);
        }
      });
      this.totalDebito = res['data']['total_debito'];
      this.totalCredito = res['data']['total_credito'];
      this.sumaDebito = res['data']['total_saldo_deudor'];
      this.sumaCredito = res['data']['total_saldo_acreedor'];
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      this.setSelectFilter();
      this.getAccountData();
    })
  }

  setSelectFilter(){
    this.grupoSeleccionado = undefined;
    this.nivelSeleccionado = undefined;
    this.claseSeleccionado = undefined;
    this.peridoSelecionado = undefined;
  }



  btnExportar() {
    if (this.permisions[0].exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      this.excelData = [];
      Object.keys(this.dataAccount).forEach(key => {
        let filter_values = {};
        filter_values['CÓDIGO'] = this.dataAccount[key].codigo;
        filter_values['NOMBRE'] = this.dataAccount[key].nombre.trim();
        filter_values['DEBE'] =  parseFloat(this.dataAccount[key].debito);
        filter_values['HABER'] = parseFloat(this.dataAccount[key].credito);
        filter_values['SALDO DEUDOR'] = (this.dataAccount[key].saldo_deudor == null) ? parseFloat("0.0") : parseFloat(this.dataAccount[key].saldo_deudor);
        filter_values['SALDO ACREEDOR'] = (this.dataAccount[key].saldo_acreedor == null) ? parseFloat("0.0") : parseFloat(this.dataAccount[key].saldo_acreedor);
        this.excelData.push(filter_values);
      })
      let arrayTotal = {};
      arrayTotal['CÓDIGO'] = "";
      arrayTotal['NOMBRE'] = "";
      arrayTotal['DEBE'] = ""
      arrayTotal['HABER'] = ""
      arrayTotal['SALDO DEUDOR'] = ""
      arrayTotal['SALDO ACREEDOR'] = ""
      this.excelData.push(arrayTotal);
      arrayTotal = {};
      arrayTotal['CÓDIGO'] = "";
      arrayTotal['NOMBRE'] = "TOTAL";
      arrayTotal['DEBE'] = parseFloat(this.totalDebito);
      arrayTotal['HABER'] = parseFloat(this.totalCredito);
      arrayTotal['SALDO DEUDOR'] = parseFloat(this.sumaDebito);
      arrayTotal['SALDO ACREEDOR'] = parseFloat(this.sumaCredito);
      this.excelData.push(arrayTotal);
      this.exportAsXLSX();
    }
  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'balance_comprobacion');
  }

  savePrint() {
    let data = {
      ip: this.commonService.getIpAddress(),
      accion: "Registro de impresion de Balance comprobación",
      id_controlador: myVarGlobals.fBalanceComprobacion
    }
    this.balanceService.printData(data).subscribe(res => {

    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }


}
