import { Component, OnInit, ViewChild } from '@angular/core';
import { EstadoFinancieroService } from '../estado-financiero.services'
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import * as moment from "moment";
import { environment } from 'src/environments/environment';
import { XlsExportService } from 'src/app/services/xls-export.service';



@Component({
  selector: 'app-estado-resultado',
  templateUrl: './estado-resultado.component.html',
  styleUrls: ['./estado-resultado.component.scss']
})
export class EstadoResultadoComponent implements OnInit {
 
 
  
  peridoSelecionado: any = 0;
  nivelSeleccionado: any = 0;
  dataLength: any;
  dataUser: any;
  permisions: any;
  data: any = [1, 2, 3, 4, 5, 6];
  balanceInit: any = [];
  balanceInitMensual: any = []
  balanceInitMensualExcel: any = []
  //numberToformat:any = 1000000000;
  locality: any;
  excelData: any = [];

  centrocosto:any = 0;
  centros: any;
  LoadOpcionCentro:boolean = false;
  gubernamental:any;

  ActulizaEstadoREsultado:boolean = false;
  MostrarndoData:boolean = false;
  MostrarndoDataMensual:boolean = false;

  viewDate: Date = new Date();
  // fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  // toDatePicker: Date = new Date();
  fromDatePicker: any ;
  toDatePicker: any;

  hoy: Date = new Date;  
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  btnPrint: any;
  processing:any = false;
  empresLogo: any;

  permiso_ver: any = "0";
  periodoVisualizacion: any

  moment: any = moment;
  firstday: any;
  today: any;
  tomorrow: any;

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  listGubernamental = [
    {value:'SI', label:'SI'},
    {value:'NO', label:'NO'}
  ]

  periodoVisua = [
    {value:'ANUAL', label:'ANUAL'},
    {value:'MENSUAL', label:'MENSUAL'}
  ]

  URL_API = environment.apiUrl

  constructor(private estadoServices: EstadoFinancieroService, private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private excelService: ExcelService, private xlsService: XlsExportService, private http: HttpClient) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    

  }

  ngOnInit(): void {

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: false},
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section", imprimir: true}
    ];

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

    this.fromDatePicker= moment(this.firstday).format('YYYY-MM-DD'),
    this.toDatePicker= moment(this.today).format('YYYY-MM-DD'),


    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    
    let data = {
      id: 2,
      codigo: myVarGlobals.festadoResultado,
      id_rol: id_rol
    }

    this.gubernamental = 'SI';

    this.commonService.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];

        this.permiso_ver = this.permisions[0].ver;

        if (this.permisions[0].ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Estado de resultados");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {

          /*
          if(this.permisions[0].imprimir == "0"){
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          }else{
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          } */

          this.lcargando.ctlSpinner(false);
          //this.getBalanceInit();
        }
    }, error=>{
      this.lcargando.ctlSpinner(false);
    })

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.MayorizarEstadosFinancieros();
        break;
      case "EXCEL":
        this.btnExportar();
        break;
      case "IMPRIMIR":
        this.savePrint();
        break;
    }
  }

  FromOrToChange() {

		this.fechasValida();
	}


  getCentroDetalle(i) {

    this.LoadOpcionCentro = true;

    this.estadoServices.ListaCentroCostos().subscribe(
      (resTotal) => {

        this.centros = resTotal["data"];
        this.LoadOpcionCentro = false;

      },
      (error) => {
        this.LoadOpcionCentro = false;
      }

    );

  }

  fechasValida(){
    let fechaActualUno = moment(this.fromDatePicker).format("YYYY-MM-DD")
    let fechaActualCambio = moment(this.toDatePicker).format("YYYY-MM-DD")
    let fechaActual = moment(this.viewDate).add(1, 'd').format("YYYY-MM-DD")
  
      if(fechaActualCambio > fechaActual ){
      this.toastr.info("Fecha No puede ser Mayor" +  " " + fechaActual);
      this.toDatePicker = new Date();
    }else if(fechaActualUno >  fechaActual){
      this.toastr.info("Fecha No puede ser Mayor" + " " + fechaActual );
      this.fromDatePicker =  new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    }
   }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }



  getParametersFilter() {
    this.lcargando.ctlSpinner(true);
    this.estadoServices.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataLength = res['data'];
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBalanceInit() {
    this.estadoServices.getBalanceInit().subscribe(res => {

      this.balanceInit = res['data'];
      this.processing = true;
      this.getParametersFilter();
      
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  consultFilter(data) {

    if (this.permisions[0].consultar == "0") {

      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para consultar");

    } else {

      this.lcargando.ctlSpinner(true);

      this.estadoServices.ObtenerEstadoResultado(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        if(res["data"].length > 0){
          res["data"].forEach(e => {
            if(e.nivel ==2){
              Object.assign(e, { class:'font-weight-bold' , size:"font-size:14px;"});
            } else if(e.nivel ==3){
              Object.assign(e, {class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
            }
            else if(e.nivel ==4){
              Object.assign(e, {class:'font-weight-bold' , size:"font-size:12px;"});
            }
            else{
              Object.assign(e, { class:'text-bold' , size:"font-size:12px;"});
            }
          })
        }
        this.balanceInit = res['data'];
        this.ActulizaEstadoREsultado = false;

        this.vmButtons[1].habilitar = false;
        //this.vmButtons[2].habilitar = false;
        if(this.balanceInit.length > 0){
          this.vmButtons[2].showimg = true;
          this.vmButtons[2].habilitar = false;
        }else{
          this.vmButtons[2].habilitar = true;
          this.vmButtons[2].showimg = true;
          
        }

      }, error => {

        this.toastr.info(error.error.message);      
        this.ActulizaEstadoREsultado = false;

      })


    }
  }
  consultFilterMensual(data) {

    if (this.permisions[0].consultar == "0") {

      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para consultar");

    } else {

      this.lcargando.ctlSpinner(true);

      this.estadoServices.ObtenerEstadoResultadoMensual(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        let codigo= ''
        let nombre= ''
        let ene = 0
        let feb = 0
        let mar = 0
        let abr = 0
        let may = 0
        let jun = 0
        let jul = 0
        let ago = 0
        let sep = 0
        let oct = 0
        let nov = 0
        let dic = 0
        let total = 0
        this.balanceInitMensual = res['data'];
        if(this.balanceInitMensual.length > 0){
          this.balanceInitMensual.forEach(e => {
            if(e.nivel ==2){
              Object.assign(e, {total_fila: false,class:'font-weight-bold' , size:"font-size:14px;"});
                ene -= parseFloat(e.ene),
                feb -= parseFloat(e.feb),
                mar -= parseFloat(e.mar),
                abr -= parseFloat(e.abr),
                may -= parseFloat(e.may),
                jun -= parseFloat(e.jun),
                jul -= parseFloat(e.jul),
                ago -= parseFloat(e.ago),
                sep -= parseFloat(e.sep),
                oct -= parseFloat(e.oct),
                nov -= parseFloat(e.nov),
                dic -= parseFloat(e.dic),
                total -= parseFloat(e.total)
            } else if(e.nivel ==3){
              Object.assign(e, {total_fila: false, class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
            }
            else if(e.nivel ==4){
              Object.assign(e, {total_fila: false, class:'font-weight-bold' , size:"font-size:12px;"});
            }
            else{
              Object.assign(e, {total_fila: false, class:'text-bold' , size:"font-size:12px;"});
            }
            
          })
        }
      
        let data = {
          class:'font-weight-bold' ,
          size:"font-size:14px;",
          total_fila:true,
          codigo: '',
          nombre: 'TOTAL: ',
          ene: ene,
          feb: feb,
          mar: mar,
          abr: abr,
          may: may,
          jun: jun,
          jul: jul,
          ago: ago,
          sep: sep,
          oct: oct,
          nov: nov,
          dic: dic,
          total: total
        }
       
        this.balanceInitMensual.push(data)
        console.log(this.balanceInitMensual)
        this.ActulizaEstadoREsultado = false;


        if(this.balanceInitMensual.length > 0){
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].showimg = false;
          this.vmButtons[2].habilitar = true;
        }else{
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[2].showimg = false;
          
        }

      }, error => {

        this.toastr.info(error.error.message);      
        this.ActulizaEstadoREsultado = false;

      })


    }
  }

  MayorizarEstadosFinancieros(){

    if(this.periodoVisualizacion == undefined ){
      this.toastr.info('Debe seleccionar un periodo de vizualización')
    }else{

      this.ActulizaEstadoREsultado = true;


      let data = {
        "fecha_desde":moment(this.fromDatePicker).format('YYYY-MM-DD'),
        "fecha_hasta":moment(this.toDatePicker).format('YYYY-MM-DD'),
        "centro_costo":this.centrocosto,
        "empresa":1,
        "gubernamental": this.gubernamental,
        "nivel": this.nivelSeleccionado
      }


   // this.estadoServices.MayorizarEstadosFinancieros(data).subscribe(res => {

      if(this.periodoVisualizacion=='MENSUAL'){
        this.consultFilter(data);
        this.ActulizaEstadoREsultado = false;
        this.MostrarndoData = true;
        this.MostrarndoDataMensual = false;
       
      }
      if(this.periodoVisualizacion=='ANUAL'){
        this.consultFilterMensual(data);
        this.ActulizaEstadoREsultado = false;
        this.MostrarndoDataMensual = true;
        this.MostrarndoData = false;
      }
        
      

    // }, error => {

    //   this.toastr.info(error.error.message);      
    //   this.ActulizaEstadoREsultado = false;

    // })
    }


    

  }

  totalFinal(){
    let total = 0
    this.balanceInit.forEach(e => {
      if(e.nivel ==2){
        total += parseFloat(e.valor); 
      }
    })
    return total;
  }

  btnExportar() {

    if(this.periodoVisualizacion=='MENSUAL'){
      
      if (this.permisions[0].exportar == "0") {
        this.toastr.info("Usuario no tiene permiso para exportar");
      } else {
        // this.mensajeSppiner = "Generando Archivo Excel..."; 
        // this.lcargando.ctlSpinner(true); 

        // let data = {
        //   "fecha_desde":moment(this.fromDatePicker).format('YYYY-MM-DD'),
        //   "fecha_hasta":moment(this.toDatePicker).format('YYYY-MM-DD'),
        //   "centro_costo":this.centrocosto,
        //   "empresa":1,
        //   "gubernamental": this.gubernamental,
        //   "nivel": this.nivelSeleccionado
        // }
        // this.estadoServices.ObtenerEstadoResultado(data).subscribe(res => {
        //   console.log(res)
        //   this.lcargando.ctlSpinner(false);
        //   if(res["data"].length > 0){
        //     res["data"].forEach(e => {
        //       if(e.nivel ==2){
        //         Object.assign(e, { class:'font-weight-bold' , size:"font-size:14px;"});
        //       } else if(e.nivel ==3){
        //         Object.assign(e, {class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
        //       }
        //       else if(e.nivel ==4){
        //         Object.assign(e, {class:'font-weight-bold' , size:"font-size:12px;"});
        //       }
        //       else{
        //         Object.assign(e, { class:'text-bold' , size:"font-size:12px;"});
        //       }
        //     })
        //   }
        //   this.balanceInit = res['data'];
         
        // }, error => {
  
        //   this.toastr.info(error.error.message);      
          
  
        // })
        //http://154.12.249.218:8080/jasperserver/rest_v2/reports/reports/rpt_estado_resultado.html?fecha_desde=2022-09-01&centro_costo=0&cod_empresa=1&fecha_hasta=2022-09-30
  
        let desde = moment(this.fromDatePicker).format('YYYY-MM-DD');
        let hasta = moment(this.toDatePicker).format('YYYY-MM-DD');
  
          http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_estado_resultado.html?fecha_desde=~NULL~&centro_costo=&fecha_inicio=01/11/2022&id_usuario=14&fecha_fin=02/12/2022&id_empresa=1&cod_empresa=&fecha_hasta=~NULL~
        //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_estado_resultado.html?fecha_desde=~NULL~&centro_costo=&fecha_inicio=01/11/2022&id_usuario=14&fecha_fin=02/12/2022&id_empresa=1&cod_empresa=&fecha_hasta=~NULL~
  
        //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_estado_resultado.html?fecha_inicio=01/11/2022&id_usuario=14&fecha_fin=02/12/2022&id_empresa=1
       
        window.open(environment.ReportingUrl + "rpt_estado_resultado.xlsx?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&desde="+desde+"&id_usuario="+this.dataUser.id_usuario+"&fecha_fin="+hasta+"&id_empresa=1", '_blank');
      
      }
    }
    if(this.periodoVisualizacion=='ANUAL'){
   
      this.mensajeSppiner = "Generando Archivo Excel..."; 
      this.lcargando.ctlSpinner(true); 
      let data = {
        "fecha_desde":moment(this.fromDatePicker).format('YYYY-MM-DD'),
        "fecha_hasta":moment(this.toDatePicker).format('YYYY-MM-DD'),
        "centro_costo":this.centrocosto,
        "empresa":1,
        "gubernamental": this.gubernamental,
        "nivel": this.nivelSeleccionado
      }

      // this.estadoServices.ObtenerEstadoResultadoMensual(data).subscribe(res => {
      //   this.lcargando.ctlSpinner(false);
      //   let codigo= ''
      //   let nombre= ''
      //   let ene = 0
      //   let feb = 0
      //   let mar = 0
      //   let abr = 0
      //   let may = 0
      //   let jun = 0
      //   let jul = 0
      //   let ago = 0
      //   let sep = 0
      //   let oct = 0
      //   let nov = 0
      //   let dic = 0
      //   let total = 0

      //   this.balanceInitMensualExcel = res['data'];
      //   if(this.balanceInitMensualExcel.length > 0){
      //     this.balanceInitMensualExcel.forEach(e => {
            
      //       Object.assign(e, { 
      //         ene: Number(parseFloat(e.ene).toFixed(2)),
      //         feb: Number(parseFloat(e.feb).toFixed(2)),
      //         mar: Number(parseFloat(e.mar).toFixed(2)),
      //         abr: Number(parseFloat(e.abr).toFixed(2)),
      //         may: Number(parseFloat(e.may).toFixed(2)),
      //         jun: Number(parseFloat(e.jun).toFixed(2)),
      //         jul: Number(parseFloat(e.jul).toFixed(2)),
      //         ago: Number(parseFloat(e.ago).toFixed(2)),
      //         sep: Number(parseFloat(e.sep).toFixed(2)),
      //         oct: Number(parseFloat(e.oct).toFixed(2)),
      //         nov: Number(parseFloat(e.nov).toFixed(2)),
      //         dic: Number(parseFloat(e.dic).toFixed(2)),
      //         total: Number(parseFloat(e.total).toFixed(2))});
      //       if(e.nivel ==2){
      //         ene += parseFloat(e.ene),
      //         feb += parseFloat(e.feb),
      //         mar += parseFloat(e.mar),
      //         abr += parseFloat(e.abr),
      //         may += parseFloat(e.may),
      //         jun += parseFloat(e.jun),
      //         jul += parseFloat(e.jul),
      //         ago += parseFloat(e.ago),
      //         sep += parseFloat(e.sep),
      //         oct += parseFloat(e.oct),
      //         nov += parseFloat(e.nov),
      //         dic += parseFloat(e.dic),
      //         total += parseFloat(e.total)
      //       } 
      //     })

      //     let datos = {
      //       codigo: '',
      //       nombre: 'TOTAL: ',
      //       ene: ene,
      //       feb: feb,
      //       mar: mar,
      //       abr: abr,
      //       may: may,
      //       jun: jun,
      //       jul: jul,
      //       ago: ago,
      //       sep: sep,
      //       oct: oct,
      //       nov: nov,
      //       dic: dic,
      //       total: total
      //     }
         
      //     this.balanceInitMensualExcel.push(datos)
          
      //     let data = {
      //       title: 'Estados de Resultados Anual',
      //       fecha_desde: this.fromDatePicker,
      //       fecha_hasta: this.toDatePicker,
      //       rows:  this.balanceInitMensualExcel
      //     }
      //     this.xlsService.exportExcelEstadoResultMensual(data, 'Estados de Resultados Anual')
      //     }else{
      //     this.toastr.info("No hay datos para exportar")
      //     this.lcargando.ctlSpinner(false); 
      //     }
      // }, error => {
      //   this.toastr.info(error.error.message);      
      //   this.lcargando.ctlSpinner(false);
      // })

      this.estadoServices.ObtenerEstadoResultadoMensual(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        let codigo= ''
        let nombre= ''
        let ene = 0
        let feb = 0
        let mar = 0
        let abr = 0
        let may = 0
        let jun = 0
        let jul = 0
        let ago = 0
        let sep = 0
        let oct = 0
        let nov = 0
        let dic = 0
        let total = 0
        let clase = ''
        this.balanceInitMensualExcel = res['data'];
        console.log(res['data'])
        if(this.balanceInitMensualExcel.length > 0){
          this.balanceInitMensualExcel.forEach(e => {
            if(e.nivel ==2){
              Object.assign(e, {total_fila: false,class:'font-weight-bold' , size:"font-size:14px;"});
                ene -= parseFloat(e.ene),
                feb -= parseFloat(e.feb),
                mar -= parseFloat(e.mar),
                abr -= parseFloat(e.abr),
                may -= parseFloat(e.may),
                jun -= parseFloat(e.jun),
                jul -= parseFloat(e.jul),
                ago -= parseFloat(e.ago),
                sep -= parseFloat(e.sep),
                oct -= parseFloat(e.oct),
                nov -= parseFloat(e.nov),
                dic -= parseFloat(e.dic),
                total -= parseFloat(e.total),
                clase = e.clase
            } else if(e.nivel ==3){
              Object.assign(e, {total_fila: false, class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
            }
            else if(e.nivel ==4){
              Object.assign(e, {total_fila: false, class:'font-weight-bold' , size:"font-size:12px;"});
            }
            else{
              Object.assign(e, {total_fila: false, class:'text-bold' , size:"font-size:12px;"});
            }
            
          })
        }else{
          this.toastr.info("No hay datos para exportar")
          this.lcargando.ctlSpinner(false); 
        }
      
        let data = {
          class:'font-weight-bold' ,
          size:"font-size:14px;",
          total_fila:true,
          codigo: '',
          nombre: 'TOTAL: ',
          ene: ene,
          feb: feb,
          mar: mar,
          abr: abr,
          may: may,
          jun: jun,
          jul: jul,
          ago: ago,
          sep: sep,
          oct: oct,
          nov: nov,
          dic: dic,
          total: total,
          clase: clase
        }
       
        this.balanceInitMensualExcel.push(data)

        this.balanceInitMensualExcel.forEach(e => {
    
          Object.assign(e, { 
            ene: Number(this.cambiarSigno(e.ene,e.clase)),
            feb: Number(this.cambiarSigno(e.feb,e.clase)),
            mar: Number(this.cambiarSigno(e.mar,e.clase)),
            abr: Number(this.cambiarSigno(e.abr,e.clase)),
            may: Number(this.cambiarSigno(e.may,e.clase)),
            jun: Number(this.cambiarSigno(e.jun,e.clase)),
            jul: Number(this.cambiarSigno(e.jul,e.clase)),
            ago: Number(this.cambiarSigno(e.ago,e.clase)),
            sep: Number(this.cambiarSigno(e.sep,e.clase)),
            oct: Number(this.cambiarSigno(e.oct,e.clase)),
            nov: Number(this.cambiarSigno(e.nov,e.clase)),
            dic: Number(this.cambiarSigno(e.dic,e.clase)),
            total: Number(this.cambiarSigno(e.total,e.clase)) });
          }) 
        let data2 = {
          title: 'Estados de Resultados Anual',
          fecha_desde: this.fromDatePicker,
          fecha_hasta: this.toDatePicker,
          rows:  this.balanceInitMensualExcel
        }
        this.xlsService.exportExcelEstadoResultMensual(data2, 'Estados de Resultados Anual')
      }, error => {

        this.toastr.info(error.error.message);      
        this.ActulizaEstadoREsultado = false;

      })
    }
   
  }

  cambiarSigno(valor: number,clase: string): number{
    if((valor  <  0  && clase=='DEUDORA')){
      return valor;
    }else if(valor > 0  && clase=='ACREEDORA'){
      return Number(- valor);
    }else{
      return Math.abs(valor);
    }
  }
  
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Estado_resultado');
  }

  savePrint() {
    if(this.periodoVisualizacion=='MENSUAL'){

      let desde = moment(this.fromDatePicker).format('YYYY-MM-DD');
      let hasta = moment(this.toDatePicker).format('YYYY-MM-DD');
  
      window.open(environment.ReportingUrl + "rpt_estado_resultado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&desde="+desde+"&id_usuario="+this.dataUser.id_usuario+"&fecha_fin="+hasta+"&id_empresa=1", '_blank');
      console.log(environment.ReportingUrl + "rpt_estado_resultado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&desde="+desde+"&id_usuario="+this.dataUser.id_usuario+"&fecha_fin="+hasta+"&id_empresa=1")
     // window.open(environment.ReportingUrl + "rpt_estado_resultado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"fecha_desde="+desde+"&centro_costo=0&fecha_inicio="+desde+"&id_usuario="+this.dataUser.id_usuario+"&fecha_fin="+hasta+"&id_empresa=1&cod_empresa=1&fecha_hasta="+hasta, '_blank');
  
      // window.open(environment.ReportingUrl + "rpt_estado_resultado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"fecha_desde="+desde+"&centro_costo=0&cod_empresa=1&fecha_hasta="+hasta+"&id_usuario="+this.dataUser.user_token_id, '_blank')
  
      /*let data = {
        ip: this.commonService.getIpAddress(),
        accion: "Registro de impresion de Estado de resultados",
        id_controlador: myVarGlobals.festadoResultado
      }
      this.estadoServices.printData(data).subscribe(res => {
  
      }, error => {
        this.toastr.info(error.error.mesagge);
      })*/
    }

  }

  selectedGuber(event){
    this.balanceInit = []
    this.balanceInitMensual = []
  }
  selectedPeriodoVisua(event){
    this.balanceInit = []
    this.balanceInitMensual = []
  }
  verDetalle(cuenta){
   // alert('cuenta:' + cuenta +'fecha_desde:'+ this.fromDatePicker +' fecha_hasta:'+ this.toDatePicker)

   let fromDatePicker = this.fromDatePicker
   let toDatePicker = this.toDatePicker
   let codigo_cuenta = cuenta

  let  fecha_desde = fromDatePicker.replace(/-/g, '');
  let  fecha_hasta = toDatePicker.replace(/-/g, '');
  //let codigo_cuenta = codigoCuenta.replace(/\./g, '');
   
    const rutaMayor = `/todotek/sis-contable/dist/#/contabilidad/reportes/movimientos/${fecha_desde}/${fecha_hasta}/${codigo_cuenta}`
    //const rutaRelativa = `/tu-ruta-interna/${anio}/${mes}`;
    const nuevaVentana = window.open('','_blank')
     if(nuevaVentana){
      nuevaVentana.location.href = rutaMayor

     }
  }

}
