import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SumasySaldosService } from './sumasysaldos.service';
import { Subject } from 'rxjs';
import { ExcelService } from '../../../../services/excel.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import * as moment from 'moment'
import { environment } from 'src/environments/environment';
@Component({
standalone: false,
  selector: 'app-sumasysaldos',
  templateUrl: './sumasysaldos.component.html',
  styleUrls: ['./sumasysaldos.component.scss']
})
export class SumasysaldosComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtAccount: any = false;
  dataUser: any;
  permisions: any;
  dataAccount: any = [];
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
  cmb_periodo: any[] = [];
  anioActual: any;
  mes_actual: any = 0;

  viewDate: Date = new Date();
 periodo= Number(moment(new Date()).format('YYYY'));
 fecha_desde= new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10);
fecha_hasta= new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10);

  //periodo: this.hoy.getFullYear()
	// fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
	// toDatePicker: Date = new Date();
  fromDatePicker: any
	toDatePicker:any




  URL_API = environment.apiUrl

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  selected_mes : any;
  arrayMes: any =
    [
      {
        id: "0",
        name: "-Todos-"
      },{
        id: "1",
        name: "Enero"
      },
      {
        id: "2",
        name: "Febrero"
      },
      {
        id: "3",
        name: "Marzo"
      },
      {
        id: "4",
        name: "Abril"
      },
      {
        id: "5",
        name: "Mayo"
      },
      {
        id: "6",
        name: "Junio"
      },
      {
        id: "7",
        name: "Julio"
      },
      {
        id: "8",
        name: "Agosto"
      },

      {
        id: "9",
        name: "Septiembre"
      },
      {
        id: "10",
        name: "Octubre"
      },
      {
        id: "11",
        name: "Noviembre"
      },
      {
        id: "12",
        name: "Diciembre"
      },
    ];


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(private commonService: CommonService, private toastr: ToastrService, private router: Router,
    private balanceService: SumasySaldosService, private excelService: ExcelService) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  ngOnInit(): void {

    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

    this.vmButtons = [
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "Procesar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-search", texto: "Consultar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "Excel" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-print", texto: "Pdf" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true}
    ];


    this.peridoSelecionado = moment(new Date()).format('YYYY');
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.fromDatePicker = moment(this.firstday).format('YYYY-MM-DD');
	  this.toDatePicker = moment(this.today).format('YYYY-MM-DD');


    setTimeout(() => {
      this.cargaInicial()
      //this.lcargando.ctlSpinner(true);
    }, 50);

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
            this.vmButtons[3].habilitar = true;
          }else{
            this.btnPrint = true
            this.vmButtons[3].habilitar = false;
          }
          console.log('danielsai');
          this.getParametersFilter();
        }
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  ChangeMesCierrePeriodos(evento: any) {
    const year = this.periodo;
    this.mes_actual = evento;

    if(evento == 0){
      const primerDia = new Date(year, 1 - 1, 1).toISOString().substring(0, 10);
      const ultimoDia = new Date(year, 12, 0).toISOString().substring(0, 10);
      this.fecha_desde= primerDia;
      this.fecha_hasta = ultimoDia;
    }else{
      const primerDia = new Date(year, evento - 1, 1).toISOString().substring(0, 10);
    const ultimoDia = new Date(year, evento, 0).toISOString().substring(0, 10);
    this.fecha_desde= primerDia;
    this.fecha_hasta = ultimoDia;
    }
  }
  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {

      (this as any).mensajeSpinner = "Cargando Períodos"
      const resPeriodos = await this.balanceService.getPeriodos()
      this.cmb_periodo = resPeriodos

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "Procesar":
        this.procesarSp();
        break;
      case "Consultar":
        this.rerender();
        break;
      case "Excel":
        this.GenerarReporteExcel();
        break;
      case "Pdf":
        this.GenerarReportePdf();
        break;
    }
  }

  getGrupoAccount() {
    this.balanceService.getGrupoAccount({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.groupAccount = res['data'];
      this.processing = true;
      //this.getAccountData();
      //this.lcargando.ctlSpinner(false);
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  lstNiveles:any = [];
  getParametersFilter() {
    this.balanceService.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      console.log(res);
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

    if(this.periodo ==undefined ){
      this.toastr.info('Debe ingresar un Período');
    }
    else if(this.mes_actual==undefined  || this.mes_actual==''){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{
  //let fecha_desde = moment(this.fromDatePicker).format('YYYY-MM-DD');
    //let fecha_hasta = moment(this.toDatePicker).format('YYYY-MM-DD');
    let fecha_desde = this.fecha_desde;
    let fecha_hasta = this.fecha_hasta;
    let centro = '0';
    let id_empresa = 1;
    let id_user = this.dataUser.id_rol;
    let nivel = this.nivelSeleccionado;
    //let anio = Number(this.anioActual)
    let mes = Number(this.mes_actual)
    let anio = this.periodo;



    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    console.log(fecha_desde)
    console.log(fecha_hasta)
    console.log(centro)
    console.log(id_empresa)
    console.log(id_user)
    console.log(nivel)
    this.balanceService.obtenerBalanceComprobacion(fecha_desde,fecha_hasta,centro,id_empresa,id_user,nivel,anio, mes).subscribe(res => {

      console.log(res)
      this.dataAccount = res;
      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
    }


  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.getAccountData();
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
    (this as any).mensajeSpinner = "Cargando...";
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
        this.dtTrigger.next(null);
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

  GenerarReporteExcel() {

    let fecha_desde = moment(this.fromDatePicker).format('YYYYMMDD');
    let fecha_hasta = moment(this.toDatePicker).format('YYYYMMDD');
    let centro = '0';
    let id_empresa = 1;
    let id_user = this.dataUser.id_rol;

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_balance_comprobacion.html?fecha_desde=20230101&id_usuario=14&centro=0&id_empresa=1&mes=&nivel=0&anio=&fecha_hasta=20230121

		window.open(environment.ReportingUrl + "rpt_balance_comprobacion.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde="+fecha_desde+"&id_usuario="+id_user+"&centro="+centro+"&id_empresa="+id_empresa+"&fecha_hasta="+fecha_hasta, '_blank')
	}


	GenerarReportePdf() {

		let fecha_desde = moment(this.fromDatePicker).format('YYYYMMDD');
    let fecha_hasta = moment(this.toDatePicker).format('YYYYMMDD');
    let centro = '0';
    let id_empresa = 1;
    let id_user = this.dataUser.id_rol;

		window.open(environment.ReportingUrl + "rpt_balance_comprobacion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde="+fecha_desde+"&id_usuario="+id_user+"&centro="+centro+"&id_empresa="+id_empresa+"&fecha_hasta="+fecha_hasta, '_blank')
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

  TotalSumaInicialDebe(){
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.saldo_inicial_deudor);
      }

    }
    return total.toFixed(2);
  }
  TotalSumaInicialHaber(){
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.saldo_inicial_acreedor);
      }

    }
    return total.toFixed(2);
  }

  TotalSumaDebe() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.debe);
      }

    }

    return total.toFixed(2);
  }

  TotalSumaHaber() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.haber);
      }
    }

    return total.toFixed(2);
  }

  TotalSumaSaldoDebe() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.saldo_deudor);
      }
    }

    return total.toFixed(2);
  }

  TotalSumaSaldoHaber() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.saldo_acreedor);
      }
    }

    return total.toFixed(2);
  }



  TotalSumaFlujoDeudor() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.flujo_deudor);
      }
    }

    return total.toFixed(2);
  }


  TotalSumaFlujoAcredor() {
    let total = 0;
    for (let sale of this.dataAccount) {
      if(sale.tipo_valor=='T'){
        total += parseFloat(sale.flujo_acreedor);
      }
    }

    return total.toFixed(2);
  }

  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt

  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  procesarSp(){


    if(this.periodo ==undefined){
      this.toastr.info('Debe ingresar un Período');
    }
    else if(this.mes_actual==undefined  || this.mes_actual==''){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{

      let data = {
        // fecha_desde: moment(this.filter.fecha_desde).format('YYYYMMDD'),
        // fecha_hasta: moment(this.filter.fecha_hasta).format('YYYYMMDD'),
        // fecha_desde: moment(this.fromDatePicker).format('YYYYMMDD'),
        // fecha_hasta: moment(this.toDatePicker).format('YYYYMMDD'),
        //anio: Number(this.anioActual),
        anio: Number(this.periodo),
        mes: Number(this.mes_actual),
        nivel:this.nivelSeleccionado
      }

      (this as any).mensajeSpinner = "Procesando...";
      this.lcargando.ctlSpinner(true);
      this.balanceService.procesarSp(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se ha procesado con éxito",
          //text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
      })
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }
  verDetalle(cuenta){
    // alert('cuenta:' + cuenta +'fecha_desde:'+ this.fromDatePicker +' fecha_hasta:'+ this.toDatePicker)
    console.log(cuenta)
    let periodo= this.periodo;
    let mes = this.mes_actual -1
    let codigo_cuenta = cuenta
    console.log(periodo )

    // FECHA DESDE
    let fecha_primer_dia = new Date(periodo, mes, 1);
    console.log(fecha_primer_dia )
    let primerDiaAnio = fecha_primer_dia.getFullYear();
    let primerDiaMes = fecha_primer_dia.getMonth() + 1;
    let primerDiaDia = fecha_primer_dia.getDate();

    let fechaDesde = primerDiaAnio + '-' + (primerDiaMes < 10 ? '0' + primerDiaMes : primerDiaMes) + '-' + (primerDiaDia < 10 ? '0' + primerDiaDia : primerDiaDia);

    let fecha_ultimo_dia = new Date(periodo, mes + 1, 1);

    // Restar un día para obtener el último día del mes actual
    fecha_ultimo_dia.setDate(fecha_ultimo_dia.getDate() - 1);

    // Obtener el año, mes y día del último día del mes
    let ultimoDiaAnio = fecha_ultimo_dia.getFullYear();
    let ultimoDiaMes = fecha_ultimo_dia.getMonth() + 1; // Los meses se indexan desde 0, por lo que sumamos 1 para obtener el mes real
    let ultimoDiaDia = fecha_ultimo_dia.getDate();

    let fechaHasta = ultimoDiaAnio + '-' + (ultimoDiaMes < 10 ? '0' + ultimoDiaMes : ultimoDiaMes) + '-' + (ultimoDiaDia < 10 ? '0' + ultimoDiaDia : ultimoDiaDia);

    let  fecha_desde = fechaDesde.replace(/-/g, '');
    let  fecha_hasta = fechaHasta.replace(/-/g, '');
    console.log(fecha_desde)
    console.log(fecha_hasta)

     const rutaMayor = `/todotek/sis-contable/dist/#/contabilidad/reportes/movimientos/${fecha_desde}/${fecha_hasta}/${codigo_cuenta}`
     //const rutaRelativa = `/tu-ruta-interna/${anio}/${mes}`;
     const nuevaVentana = window.open('','_blank')
      if(nuevaVentana){
       nuevaVentana.location.href = rutaMayor

      }
   }




}
