import { Component, OnInit, ViewChild } from '@angular/core';

import { FlujoCajaProyectadoService } from './flujo-de-caja-proyectado.service';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { sep } from 'path';
@Component({
standalone: false,
  selector: 'app-flujo-de-caja-proyectado',
  templateUrl: './flujo-de-caja-proyectado.component.html',
  styleUrls: ['./flujo-de-caja-proyectado.component.scss']
})
export class FlujoDeCajaProyectadoComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Flujo de Caja Proyectado";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;
  willDownload = false;

  jsonData: any;
  dataExcel: any = [];
  dataFlujoNew : any = [];
  cmb_periodo: any[] = [];

  file: any;
  
  //periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;
  reporte: any = [];
  headersEnable = false;



  plantillaExcel: any = [];

  titles: any = [];
  break = false;
  tipoReforma: any = 0;

  catalog: any = [];
  no_reforma: any;
  periodo: any = new Date();

  fileValid:any;
  fecha_ingreso:any = new Date();
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
    private apiSrv: FlujoCajaProyectadoService,
    private excelSrv: ExcelService,
    private xlsService : XlsExportService,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
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
      this.showDataFlujoProyectado();
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

  showDataFlujoProyectado(){
    if ( this.periodo == undefined) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }else{
    let datos = {
      // periodo: this.periodo.getFullYear(),
      periodo: this.periodo,
    };
    this.mensajeSpiner ='Generando...';
    this.lcargando.ctlSpinner(true);
     console.log(datos);
    this.apiSrv.getFlujosProyectado(datos).subscribe(
      res => {
          this.reporte=res['data'];
          this.reporte.forEach(e => {
             console.log(e.ene);
          })
        this.toastr.info('Consulta realizada con éxito')
        this.lcargando.ctlSpinner(false);
    })
    this.vmButtons[0].habilitar = false;
    this.vmButtons[3].habilitar = false;
    }
}

limpiarData(){
  this.periodo =  moment().format('YYYY');
  this.reporte = [];
  this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();


}



guardarValores(){
  let datos = {
    reporte: this.reporte,
    //periodo: Number(this.periodo.getFullYear()),
    periodo: Number(this.periodo),
    mes: Number(this.mes_actual)
  };
  console.log(this.reporte);
  this.mensajeSpiner ='Guardando...';
  this.lcargando.ctlSpinner(true);
    this.apiSrv.saveFlujoCajaProyectado(datos).subscribe(
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
        this.showDataFlujoProyectado()
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

  this.titles = [descripcion,enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre,total];


  //this.exportAsXLSX(rep, 'Proyeccion de Gastos',{ header: this.titles });

  this.xlsService.exportReporteFlujoCaja('Flujo de Caja Proyectado', rep);

}
ejecutarSP(){
  if(this.periodo ==undefined){
    this.toastr.info('Debe seleccionar un período');
  }
  else if(this.mes_actual==undefined || this.mes_actual==''){
    this.toastr.info('Debe seleccionar un mes');
  }
  else{

    let data = {
      //periodo: Number(this.periodo.getFullYear()),
      periodo: Number(this.periodo),
      mes: Number(this.mes_actual)
    }
  
    this.lcargando.ctlSpinner(true);
    this.apiSrv.setEjecutarFlujoCajaProyectadoSp(data).subscribe(res => {
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
}

descargarFlujoCaja(){
  let rep = []
  let data = {
    title: '',
  }
  let descripcion='DESCRIPCION';
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
  // let total = 'TOTAL';
  let copy = JSON.parse(JSON.stringify(this.reporte));
  console.log(copy);
  copy.forEach(e => {
    const data1 = {
      'TIPO_CONCEPTO':e.tipo_concepto,
      'DESCRIPCION': e.descripcion,
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
      // 'TOTAL': parseFloat(e.total),
    }
    rep.push(data1)
  })
  data['rep'] = rep
  console.log( data['rep']);
  console.log(rep)

  this.titles = [descripcion,enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre/*,total*/];


  //this.exportAsXLSX(rep, 'Proyeccion de Gastos',{ header: this.titles });

  this.xlsService.exportPlantillaFlujoCaja('Plantilla Flujo de Caja Proyectado', rep);

}

onFileChange(ev) {
  let workBook = null;
  let jsonData = null;
  const reader = new FileReader();
  this.file = ev.target.files[0];

  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial, name) => {
      
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      // console.log('two',initial);
      return initial;
    }, {});
    console.log(workBook);
    const dataString = JSON.stringify(jsonData);
    this.jsonData = jsonData;
    console.log(jsonData);
    this.btnDisabled = false;
     //this.fillTable(jsonData);
    
  }
  reader.readAsBinaryString(this.file);
}

cargarPlantilla() {
  console.log(this.periodo);
  // this.toastr.info('Agregue un archivo excel correspondiente al periodo '+this.periodo);
  // this.file = undefined;
  if(this.periodo<2000 || this.periodo>2050){
    this.toastr.warning('Ingrese un periodo valido ');
    this.periodo = undefined;
    return ;
  }
  this.break = false;
  console.log(this.jsonData);
  this.fillTable(this.jsonData);
}

fillTable(dataJson) {

  let year = this.periodo;
  let descripcion = '';
  let ene = 'ENE';
  let feb = 'FEB';
  let mar = 'MAR';
  let abr = 'ABR';
  let may = 'MAY';
  let jun = 'JUN';
  let jul = 'JUL';
  let ago = 'AGO';
  let sep = 'SEP';
  let oct = 'OCT';
  let nov = 'NOV';
  let dic = 'DIC';

  if(dataJson['rep']){
    let arr = dataJson['rep'];
    this.dataFlujoNew = [];
    arr.forEach(e => {
      let data = {
        descripcion : e['DESCRIPCION']?? this.notDesc(),
        ene : e['ENERO']??this.notData(),
        feb : e['FEBRERO']??this.notData(),
        mar : e['MARZO']??this.notData(),
        abr : e['ABRIL']??this.notData(),
        may : e['MAYO']??this.notData(),
        jun : e['JUNIO']??this.notData(),
        jul : e['JULIO']??this.notData(),
        ago : e['AGOSTO']??this.notData(),
        sep : e['SEPTIEMBRE']??this.notData(),
        oct : e['OCTUBRE']??this.notData(),
        nov : e['NOVIEMBRE']??this.notData(),
        dic : e['DICIEMBRE']??this.notData(),
      }
      this.dataFlujoNew.push(data);
    })
   
    this.titles =  [descripcion, ene, feb, mar, abr, may, jun,jul, ago, sep, oct, nov, dic];
    if(this.break){
      this.dataFlujoNew = [];
      this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
      return ;
    }

    this.cargarFlujo()
    this.yearDisabled = true;
    this.headersEnable = true;
  }else{
    this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
  }
}

  notData(): number {
    this.break = true;
    return 0;
  }
  notDesc(): string {
    this.break = true;
    return '';
  }

  cargarFlujo(){
    console.log(this.dataFlujoNew)
    console.log(this.reporte)
    let data = []

    this.reporte.forEach(e => {
      console.log(e.descripcion)
      
     // let datosNew = this.dataFlujoNew.filter(flujo => flujo.descripcion == e.descripcion )
      let datosNew = this.dataFlujoNew
      .filter(flujo => flujo.descripcion === e.descripcion)
      .map(flujo => ({
        descripcion: flujo.descripcion,
        ene: flujo.ene,
        feb: flujo.feb,
        mar:flujo.mar,
        abr:flujo.abr,
        may:flujo.may,
        jun:flujo.jun,
        jul:flujo.jul,
        ago:flujo.ago,
        sep:flujo.sep,
        oct:flujo.oct,
        nov:flujo.nov,
        dic:flujo.dic
      }));
      data.push(datosNew)
      console.log(data);

        console.log(datosNew)
       if(datosNew.length > 0){
        if(e.descripcion === datosNew[0].descripcion ){
          Object.assign(e,
            {
            //descripcion: datosNew[0].descripcion,
             ene: datosNew[0].ene,
             feb: datosNew[0].feb,
             mar: datosNew[0].mar,
             abr: datosNew[0].abr,
             may: datosNew[0].may,
             jun: datosNew[0].jun,
             jul: datosNew[0].jul,
             ago: datosNew[0].ago,
             sep: datosNew[0].sep,
             oct: datosNew[0].oct,
             nov: datosNew[0].nov,
             dic: datosNew[0].dic,
           });
        }
        
       }
     
      // You can now do something with datosNew for each element 'e' in reporte
     
     // let datosNew = this.dataFlujoNew.filter(flujo => flujo.descripcion == e.descripcion )
     
    });
    this.toastr.info("¡Su plantilla fue cargada con éxito!")
   // this.reporte = { ...this.reporte, ...data }
    console.log(this.reporte)
  }




}
