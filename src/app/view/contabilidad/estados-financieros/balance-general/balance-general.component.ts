import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { BalanceGeneralService } from './balance-general.service';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowCabComponent } from './show-cab/show-cab.component';
import Swal from "sweetalert2";;
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { XlsExportService } from 'src/app/services/xls-export.service';

import { environment } from 'src/environments/environment';
import * as moment from 'moment'

@Component({
standalone: false,
  selector: 'app-balance-general',
  templateUrl: './balance-general.component.html',
  styleUrls: ['./balance-general.component.scss']
})
export class BalanceGeneralComponent implements OnInit {
  processing: any = false;
  dataUser: any;
  empresLogo: any;
  permisions: any;
  arr: any = [];
  aniosFilter: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  anioActual: any;
  peridoSelecionado: any = 0;
  nivelSeleccionado: any = 4;
  arrayInfo: any;
  arrayInfoAux: any;
  searchAccount: any = null;
  btnPrint: any = false;
  excelData: any = [];
  locality: any;
  infoAccount: any;
  infoAccountDet: any = [];
  dataLength: any = [];

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

  periodo: Date = new Date();

  mes_actual: any = 0;
  centros: any;
  centrocosto:any = 0;
  LoadOpcionCentro:boolean = false;
  MostrarndoData:boolean = false;
  MostrarndoDataMensual: boolean = false;

  infomovDataMensual: any = []

  infomovDataMensualExcel: any = []

  URL_API = environment.apiUrl;

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

    listGubernamental = [
      {value:'SI', label:'SI'},
      {value:'NO', label:'NO'}
    ]
    gubernamental: any

    periodoVisua = [
      {value:'ANUAL', label:'ANUAL'},
      {value:'MENSUAL', label:'MENSUAL'}
    ]
    periodoVisualizacion: any



  constructor(
    private blcSrv: BalanceGeneralService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private xlsService: XlsExportService
  ) { }

  ngOnInit(): void {

   // this.anioActual =   moment(new Date()).format('YYYY');
    //this.mes_actual = Number(moment(new Date()).format('MM'));
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();


    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnBlgnr", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnBlgnr", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: false },
      { orig: "btnBlgnr", paramAccion: "1", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: false },
      { orig: "btnBlgnr", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, imprimir: false }
    ];

    this.getPermisions();
  }
  mesString(mes){

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  var numeroMes = parseInt(mes);
  if(! isNaN(numeroMes) && numeroMes >= 1  && numeroMes <= 12 ) {
    return meses[numeroMes - 1];
  }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.ObtenerBalance()
        //this.MayorizarEstadosFinancieros();
        break;
      case "EXCEL":
        this.btnExportarExcel();
        break;
      case "PDF":
          this.btnExportarPdf();
          break;
      case "IMPRIMIR":
        this.btnExportarImpresion();
        break;
    }
  }


  infomovData:any = [];

  ObtenerBalance(){

    if(this.periodo.getFullYear()==undefined ){
      this.toastr.info('Debe ingresar un período')
    }else if(this.periodoVisualizacion == undefined){
      this.toastr.info('Debe seleccionar un período de vizualización')
    } else{


      if(this.periodoVisualizacion=='MENSUAL'){
        if(this.mes_actual == 0 || this.mes_actual == undefined){
          this.toastr.info('Debe seleccionar un mes')
        }else{
          this.MostrarndoData = true;
          this.MostrarndoDataMensual = false;
          this.lcargando.ctlSpinner(true);


          //this.blcSrv.obtenerBalanceGeneral(this.anioActual, this.mes_actual, this.centrocosto,1,this.nivelSeleccionado).subscribe(res => {
          this.blcSrv.obtenerBalanceGeneral(Number(this.periodo.getFullYear()), this.mes_actual, this.centrocosto == null || this.centrocosto == undefined ? 0 : this.centrocosto,1,this.nivelSeleccionado,this.gubernamental).subscribe(res => {
            this.infomovData = res;
            console.log(res)
            if(this.infomovData.length > 0){
              this.infomovData.forEach(e => {
                if(e.nivel ==1){
                  Object.assign(e, { class:'font-weight-bold' , size:"font-size:15px;"});
                }
                else if(e.nivel ==2){
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
            this.lcargando.ctlSpinner(false);
            if(this.infomovData.length > 0){
              this.vmButtons[1].habilitar = false;
              this.vmButtons[2].showimg = true;
              this.vmButtons[3].showimg = true;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
            }else{
              this.vmButtons[1].habilitar = true;
              this.vmButtons[2].showimg = true;
              this.vmButtons[3].showimg = true;
              this.vmButtons[2].habilitar = true;
              this.vmButtons[3].habilitar = true;
            }



        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })
        }



      }
      if(this.periodoVisualizacion=='ANUAL'){
        this.MostrarndoData = false;
        this.MostrarndoDataMensual = true;

        this.lcargando.ctlSpinner(true);

        this.blcSrv.obtenerBalanceGeneralMensual(Number(this.periodo.getFullYear()), this.mes_actual, this.centrocosto,1,this.nivelSeleccionado,this.gubernamental).subscribe(res => {
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
            this.infomovDataMensual = res;
            if(this.infomovDataMensual.length > 0){
              this.infomovDataMensual.forEach(e => {
                if(e.nivel ==1){
                  Object.assign(e, {class:'font-weight-bold' , size:"font-size:15px;"});
                }
                else if(e.nivel ==2){
                  Object.assign(e, { class:'font-weight-bold' , size:"font-size:14px;"});
                  ene += parseFloat(e.ene),
                  feb += parseFloat(e.feb),
                  mar += parseFloat(e.mar),
                  abr += parseFloat(e.abr),
                  may += parseFloat(e.may),
                  jun += parseFloat(e.jun),
                  jul += parseFloat(e.jul),
                  ago += parseFloat(e.ago),
                  sep += parseFloat(e.sep),
                  oct += parseFloat(e.oct),
                  nov += parseFloat(e.nov),
                  dic += parseFloat(e.dic),
                  total += parseFloat(e.total)
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

            let data = {
              class:'font-weight-bold' ,
              size:"font-size:15px;",
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

            this.infomovDataMensual.push(data)
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
            this.vmButtons[3].habilitar = true;
            this.vmButtons[2].showimg = false;
            this.vmButtons[3].showimg = false;


          }, error => {
            this.toastr.info(error.error.message);
            this.lcargando.ctlSpinner(true);
          })
      }

    }


  }

  getPermisions() {

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fBalanceGeneral,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de balance general");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        (this.permisions.imprimir == "0") ? this.btnPrint = false : this.btnPrint = true;

        /*if (this.permisions.imprimir == "0") {
          this.btnPrint = false;
          this.vmButtons[1].habilitar = true;
        } else {
          this.btnPrint = true
          this.vmButtons[1].habilitar = false;
        }*/

        this.getParametersFilterOne();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getParametersFilterOne() {
    this.blcSrv.getParametersFilterOne({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {

      this.lcargando.ctlSpinner(false);
      //this.aniosFilter = res['data'];
      //this.aniosFilter = this.aniosFilter.filter(e => e.periodos != this.anioActual);
      //this.getMoves();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getMoves() {
    this.blcSrv.getMoves().subscribe(res => {
      console.log(res['data']);
      this.infoAccount = res['data'];
      this.infoAccount.forEach(element => {
        element['detalle'].forEach(elem => {
          this.infoAccountDet.push(elem);
        });
      });
      this.getParametersFilter();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getParametersFilter() {
    this.blcSrv.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.dataLength = res['data'];
      this.getInitialBalance();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getInitialBalance() {
    let data = {};
    data['nivel'] = this.nivelSeleccionado;
    //data['anio'] = this.anioActual;
    data['anio'] = Number(this.periodo.getFullYear());
    if (this.peridoSelecionado != 0) { data['periodo'] = this.peridoSelecionado }
    this.lcargando.ctlSpinner(true);
    this.blcSrv.getInitialBalance(data).subscribe(res => {
      this.arrayInfo = res['data']['balance'];

      console.log(this.arrayInfo);

      Object.keys(this.arrayInfo).forEach(key => {
        this.arrayInfo[key]['current_total'] = parseFloat(this.arrayInfo[key]['current_total']).toFixed(2);
        this.arrayInfo[key]['compare_total'] = parseFloat(this.arrayInfo[key]['compare_total']).toFixed(2);
        this.arrayInfo[key]['current_old'] = parseFloat(this.arrayInfo[key]['current_old']).toFixed(2);
      })

      this.arrayInfoAux = res['data']['balance'];
      Object.keys(this.arrayInfo).forEach(key => {
        this.arrayInfoAux[key]['current_total'] = parseFloat(this.arrayInfoAux[key]['current_total']).toFixed(2);
        this.arrayInfoAux[key]['compare_total'] = parseFloat(this.arrayInfoAux[key]['compare_total']).toFixed(2);
        this.arrayInfoAux[key]['current_old'] = parseFloat(this.arrayInfoAux[key]['current_old']).toFixed(2);
      })
      this.processing = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  searchFilterAccount() {
    this.arrayInfo = this.arrayInfoAux;
    this.arrayInfo = this.arrayInfo.filter(e => e.nombre.toString().toLowerCase().substring(0, this.searchAccount.length) == this.searchAccount.toString().toLowerCase() /* ||
                                           e.codigo.toString().substring(0,this.searchAccount.length) == this.searchAccount.toString() */);
  }

  btnExportarExcel() {
    if(this.periodoVisualizacion=='MENSUAL'){
      //window.open(environment.ReportingUrl + "rpt_estado_situacion_financiera.xlsx?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&centro="+(this.centrocosto == null || this.centrocosto == undefined ? 0 : this.centrocosto)+"&id_empresa=1&mes="+this.mes_actual+"&nivel=0&anio="+this.anioActual, '_blank');
      window.open(environment.ReportingUrl + "rpt_estado_situacion_financiera.xlsx?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&centro="+(this.centrocosto == null || this.centrocosto == undefined ? 0 : this.centrocosto)+"&id_empresa=1&mes="+this.mes_actual+"&nivel=0&anio="+ Number(this.periodo.getFullYear()), '_blank');
    }
    if(this.periodoVisualizacion=='ANUAL'){

      (this as any).mensajeSpinner = "Generando Archivo Excel...";
      this.lcargando.ctlSpinner(true);

      this.blcSrv.obtenerBalanceGeneralMensual(Number(this.periodo.getFullYear()), this.mes_actual, this.centrocosto,1,this.nivelSeleccionado,this.gubernamental).subscribe(res => {
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

        this.infomovDataMensualExcel = res;
        if(this.infomovDataMensualExcel.length > 0){
          this.infomovDataMensualExcel.forEach(e => {
            Object.assign(e, {
              ene: Number(parseFloat(e.ene).toFixed(2)),
              feb: Number(parseFloat(e.feb).toFixed(2)),
              mar: Number(parseFloat(e.mar).toFixed(2)),
              abr: Number(parseFloat(e.abr).toFixed(2)),
              may: Number(parseFloat(e.may).toFixed(2)),
              jun: Number(parseFloat(e.jun).toFixed(2)),
              jul: Number(parseFloat(e.jul).toFixed(2)),
              ago: Number(parseFloat(e.ago).toFixed(2)),
              sep: Number(parseFloat(e.sep).toFixed(2)),
              oct: Number(parseFloat(e.oct).toFixed(2)),
              nov: Number(parseFloat(e.nov).toFixed(2)),
              dic: Number(parseFloat(e.dic).toFixed(2)),
              total: Number(parseFloat(e.total).toFixed(2))});
            if(e.nivel ==2){
              ene += parseFloat(e.ene),
              feb += parseFloat(e.feb),
              mar += parseFloat(e.mar),
              abr += parseFloat(e.abr),
              may += parseFloat(e.may),
              jun += parseFloat(e.jun),
              jul += parseFloat(e.jul),
              ago += parseFloat(e.ago),
              sep += parseFloat(e.sep),
              oct += parseFloat(e.oct),
              nov += parseFloat(e.nov),
              dic += parseFloat(e.dic),
              total += parseFloat(e.total)
            }
          })
          let datos = {
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

          this.infomovDataMensualExcel.push(datos)

          let data = {
            title: 'Balance General Mensual',
            periodo: this.periodo.getFullYear(),
            rows:  this.infomovDataMensualExcel
          }
          this.xlsService.exportExcelBalanceGralMensual(data, 'Balance General Mensual')
          }else{
          this.toastr.info("No hay datos para exportar")
          this.lcargando.ctlSpinner(false);
          }
      }, error => {
        this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
      })
    }


  }



  btnExportarPdf() {

    let centroCosto = this.centrocosto == null || this.centrocosto == undefined ? 0 : this.centrocosto
    console.log(centroCosto)
    if(this.periodoVisualizacion=='MENSUAL'){
      if(centroCosto == 0 || centroCosto == undefined){
        window.open(environment.ReportingUrl + "rpt_estado_situacion_financiera_sin_centro.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empresa=1&mes="+this.mes_actual+"&nivel="+this.nivelSeleccionado+"&anio="+Number(this.periodo.getFullYear())+"&gubernamental="+ (this.gubernamental != null && this.gubernamental == 'SI' ? 'SI' : 'NO'), '_blank');
      console.log(environment.ReportingUrl + "rpt_estado_situacion_financiera_sin_centro.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empresa=1&mes="+this.mes_actual+"&nivel="+this.nivelSeleccionado+"&anio="+Number(this.periodo.getFullYear())+"&gubernamental="+ (this.gubernamental != null && this.gubernamental == 'SI' ? 'SI': 'NO'));
      }
      if(centroCosto != 0 || centroCosto != undefined){
        window.open(environment.ReportingUrl + "rpt_estado_situacion_financiera.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&centro="+centroCosto+"&id_empresa=1&mes="+this.mes_actual+"&nivel="+this.nivelSeleccionado+"&anio="+Number(this.periodo.getFullYear())+"&gubernamental="+ (this.gubernamental != null || this.gubernamental != 'NO' ? 'SI' : 'NO'), '_blank');
      }
    }
  }

  btnExportarImpresion() {
    window.open(environment.ReportingUrl + "rpt_estado_situacion_financiera.html?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&centro="+(this.centrocosto == null || this.centrocosto == undefined ? 0 : this.centrocosto)+"&id_empresa=1&mes="+this.mes_actual+"&nivel=0&anio="+Number(this.periodo.getFullYear()), '_blank');
  }

  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Balance general');
  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }


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
  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt
  }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion de Balance general",
      id_controlador: myVarGlobals.fBalanceGeneral
    }
    this.blcSrv.printData(data).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  viewsMoves(evt) {
    let arrayAccAux = [];
    let infoAcc = this.infoAccountDet.filter(ed => ed.cuenta == evt || ed.codigo_cta == evt);
    if (infoAcc.length > 0) {
      infoAcc.forEach(element => {
        this.infoAccount.forEach(elm => {
          if ((elm.id == element.fk_cont_mov_cab && elm.IDENTIFICADOR == "M") /* ||
            (elm.id == element.fk_cdi && elm.IDENTIFICADOR == "I") ||
            (elm.id == element.fk_cde && elm.IDENTIFICADOR == "E") */) {
            arrayAccAux.push(elm);
          }
        });
      });
      const modalInvoice = this.modalService.open(ShowCabComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fBalanceGeneral;
      modalInvoice.componentInstance.infoAccount = arrayAccAux;
      modalInvoice.componentInstance.Account = evt;
    } else {
      Swal.fire({
        title: 'Error!!',
        text: "No existe movimientos para esta cuenta!!",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    }
  }


  getCentroDetalle(i) {

    this.LoadOpcionCentro = true;

    this.blcSrv.ListaCentroCostos().subscribe(
      (resTotal) => {
        this.centros = resTotal["data"];
        this.LoadOpcionCentro = false;
      },
      (error) => {
        this.LoadOpcionCentro = false;
      }

    );

  }


  MayorizarEstadosFinancieros() {

    if(this.periodo.getFullYear()==undefined ){
      this.toastr.info('Debe ingresar un período')
    }else{
      let fecha_desde = moment(`${this.periodo.getFullYear()}-${this.mes_actual}-01`).format('YYYY-MM-DD')
      let fecha_hasta = moment(fecha_desde).endOf('month').format('YYYY-MM-DD')
      this.lcargando.ctlSpinner(true);
      let data = {
        // "fecha_desde": moment(this.fromDatePicker).format('YYYY-MM-DD'),
        // "fecha_hasta": moment(this.toDatePicker).format('YYYY-MM-DD'),
        fecha_desde, fecha_hasta,
        "centro_costo": this.centrocosto,
        "empresa": 1
      }
      this.blcSrv.MayorizarEstadosFinancieros(data).subscribe(res => {
        this.ObtenerBalance();
      }, error => {
        this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
      })
    }


  }
  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

   selectedGuber(event){
    this.infomovData = []
  }

  totalFinal(){
    let total = 0
    this.infomovData.forEach(e => {
      if(e.nivel ==2){
        total += parseFloat(e.valor);
      }
    })
    //console.log(total)
    return total;
  }

  selectedPeriodoVisua(event){
    this.infomovData = []
    this.infomovDataMensual = []
  }

  verDetalle(cuenta){
    // alert('cuenta:' + cuenta +'fecha_desde:'+ this.fromDatePicker +' fecha_hasta:'+ this.toDatePicker)

    let periodo= Number(this.periodo.getFullYear())
    console.log(periodo )
    let mes = this.mes_actual - 1
    let codigo_cuenta = cuenta

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
