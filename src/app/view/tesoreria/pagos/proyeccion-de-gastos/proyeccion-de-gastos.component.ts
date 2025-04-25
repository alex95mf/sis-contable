import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ProyeccionGastosService } from './proyeccion-de-gastos.service';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { element } from 'angular';
@Component({
  selector: 'app-proyeccion-de-gastos',
  templateUrl: './proyeccion-de-gastos.component.html',
  styleUrls: ['./proyeccion-de-gastos.component.scss']
})
export class ProyeccionDeGastosComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Proyeccion de Gastos";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;
  willDownload = false;

  jsonData: any;
  dataExcel: any = [];

  file: any;
  
  //periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;

  headersEnable = false;
  reporte: any = [];
  plantillaExcel: any = [];
  cmb_periodo: any[] = []

  titles: any = [];
  break = false;
  tipoReforma: any = 0;

  catalog: any = [];
  no_reforma: any;

  fileValid:any;
  fecha_ingreso:any = new Date();
  periodo: any = new Date();
  mes_actual: any = 0;
  selected_mes : any;
  arrayMes: any =
    [
      // {
      //   id: "0",
      //   name: "-Todos-"
      // },
      {
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

  constructor(
    private apiSrv: ProyeccionGastosService,
    private excelSrv: ExcelService,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
    private xlsService : XlsExportService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: true, imprimir: false},
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-floppy-o", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-floppy-o", texto: "PROCESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-eraser", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},

    ];
  

  this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
  this.periodo =  moment().format('YYYY');

  setTimeout(async () => {
    await this.cargaInicial()
  }, 10);
}
metodoGlobal(evento: any) {
  switch (evento.items.boton.texto) {

    case "GUARDAR":
      this.guardarValores(); 
    break;
    case "CONSULTAR": 
      this.showDataProyeccionGastos(true);
    break;
    case "PROCESAR": 
      this.ejecutarSP();
    break;
    case "LIMPIAR": 
      this.limpiarData();
    break;
    case "EXCEL": 
      this.getDataExportar();
    break;

  }
}

async cargaInicial() {
  try {
    this.mensajeSpiner = "Carga Inicial"
    const resPeriodos = await this.apiSrv.getPeriodos()
    console.log(resPeriodos)
    this.cmb_periodo = resPeriodos
  } catch (err) {
    console.log(err)
    this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
  }
}
periodoSelected(evt: any, year:any){
  console.log(evt)
  this.periodo = evt
}
  showDataProyeccionGastos(valor){
    if (this.periodo == undefined) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }else{
    let datos = {
      //periodo: this.periodo.getFullYear(),
      periodo: Number(this.periodo),
    };
    this.mensajeSpiner ='Generando...';
    this.lcargando.ctlSpinner(true);
     console.log(datos);
    this.apiSrv.getGastosProyectados(datos).subscribe(
      res => {
        console.log(res['data'])
          this.reporte=res['data'];
          this.reporte.forEach(e => {
             console.log(e.ene);
          })
        if(valor){
          this.toastr.info('Consulta realizada con éxito')
        }
        
        this.lcargando.ctlSpinner(false);
    })
    this.vmButtons[0].habilitar = false;
    this.vmButtons[3].habilitar = false;
  }
}

limpiarData(){
  this.periodo = moment().format('YYYY');
  this.reporte = [];
  this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

}


guardarValores(){

  let datos = {
    reporte: this.reporte,
    //periodo:Number( this.periodo.getFullYear()),
    periodo:Number(this.periodo),
    mes: Number(this.mes_actual)
  };
  console.log(this.reporte);
  this.mensajeSpiner ='Guardando...';
  this.lcargando.ctlSpinner(true);
    this.apiSrv.saveProyeccionGastos(datos).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Registro guardado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
        this.showDataProyeccionGastos(false)
        this.lcargando.ctlSpinner(false);
    })
    this.vmButtons[4].habilitar = false;
    this.vmButtons[0].habilitar = true;
}

getDataExportar() {
  let rep = []
  let data = {
    title: '',
  }
  let descripcion='DESCRIPCION';
  let monto='MONTO';
  let abonos='ABONOS';
  let enero = 'ENE';
  let febrero = 'FEB';
  let marzo = 'MAR';
  let abril = 'ABR';
  let mayo = 'MAY';
  let junio = 'JUN';
  let julio = 'JUL';
  let agosto = 'AGO';
  let septiembre = 'SEP';
  let octubre = 'OCT';
  let noviembre = 'NOV';
  let diciembre = 'DIC';
  let total = 'TOTAL';
  let copy = JSON.parse(JSON.stringify(this.reporte));
  console.log(copy);
  copy.forEach(e => {
    const data1 = {
      'TIPO_CONCEPTO':e.tipo_concepto,
      'DESCRIPCION': e.descripcion,
      'MONTO': parseFloat(e.monto),
      'ABONOS':parseFloat(e.abonos),
      'ENE': parseFloat(e.ene),
      'FEB': parseFloat(e.feb),
      'MAR': parseFloat(e.mar),
      'ABR':  parseFloat(e.abr),
      'MAY': parseFloat(e.may),
      'JUN': parseFloat(e.jun),
      'JUL': parseFloat(e.jul),
      'AGO': parseFloat(e.ago),
      'SEP': parseFloat(e.sep),
      'OCT': parseFloat(e.oct),
      'NOV': parseFloat(e.nov),
      'DIC': parseFloat(e.dic),
      'TOTAL': parseFloat(e.total),
    }
    rep.push(data1)
  })
  data['rep'] = rep
  console.log( data['rep']);
  console.log(rep)

  this.titles = [descripcion,monto,abonos,enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre,total];


  //this.exportAsXLSX(rep, 'Proyeccion de Gastos',{ header: this.titles });

  this.xlsService.exportReporteProyeccionGastos('Proyeccion de Gastos', rep);
}
ejecutarSP(){
  if(this.periodo ==undefined ){
    this.toastr.info('Debe seleccionar un período');
  }
  else if(this.mes_actual==undefined || this.mes_actual==''){
    this.toastr.info('Debe seleccionar un mes');
  }
  else{

    let data = {
      //periodo:Number( this.periodo.getFullYear()),
      periodo:Number( this.periodo),
      mes: Number(this.mes_actual)
    }
  
    this.lcargando.ctlSpinner(true);
    this.apiSrv.setEjecutarProyeccionGastosSp(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      console.log(res)
      if(res['status'] == 1){
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
      }else{
        this.lcargando.ctlSpinner(false);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
        });
      }
      //this.toastr.info('El proceso fue ejecutado con éxito');
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }
}
onlyNumber(event): boolean {
  let key = event.which ? event.which : event.keyCode;
  if (key > 31 && (key < 48 || key > 57)) {
    return false;
  }
  return true;
}

handleRowCheck(event, reporte, index,monto) {
  console.log(event)
  console.log(index)
  if(event.target.checked){
    reporte[index].abonos = monto
    reporte[index].ene =  monto
    reporte[index].feb =  monto
    reporte[index].mar =  monto
    reporte[index].abr =  monto
    reporte[index].may =  monto
    reporte[index].jun =  monto
    reporte[index].jul =  monto
    reporte[index].ago =  monto
    reporte[index].sep =  monto
    reporte[index].oct =  monto
    reporte[index].nov =  monto
    reporte[index].dic =  monto
  }
  // this.lst_tipo_contrato.map((item: TipoContrato) => {
  //   rubro.lst_tipo_contrato[item.cat_keyword] = event.target.checked
  // })
}


/*exportAsXLSX(body, title, header) {
  this.excelSrv.exportAsExcelFile(body, title, header);

}*/




}
