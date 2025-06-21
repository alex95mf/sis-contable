import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { FlujoCajaService } from './flujo-de-caja-service';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { XlsExportService } from 'src/app/services/xls-export.service';
import moment from 'moment';
@Component({
standalone: false,
  selector: 'app-flujo-de-caja',
  templateUrl: './flujo-de-caja.component.html',
  styleUrls: ['./flujo-de-caja.component.scss']
})
export class FlujoDeCajaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Flujo de Caja";
  reporte: any = [];
  vmButtons: any = [];
  dataUser: any;
  permisos: any;
  willDownload = false;
  filter: any;
  jsonData: any;
  dataExcel: any = [];
  cmb_periodo: any[] = []

  file: any;

 // periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;

  headersEnable = false;

  plantillaExcel: any = [];
  descripcion: any;
  ene: any;
  feb: any;
  mar: any;
  abr: any;
  may: any;
  jun: any;
  jul: any;
  ago: any;
  sep: any;
  oct: any;
  nov: any;
  dic: any;
  total: any;

  titles: any = [];
  break = false;
  tipoReforma: any = 0;
  periodo: any = new Date();

  catalog: any = [];
  no_reforma: any;
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

  fileValid:any;
  fecha_ingreso:any = new Date();
  constructor(
    private apiSrv: FlujoCajaService,
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
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-eraser", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnAsignacionIngresos", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},

    ];
    this.filter = {
     periodo: undefined
    }
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

  this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  this.periodo =  moment().format('YYYY');
  setTimeout(async () => {
    await this.cargaInicial()
  }, 10);
}
ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {

      case "GUARDAR":
        this.guardarValores();
      break;
      case "CONSULTAR":
        this.showDataFlujoCaja();
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
      (this as any).mensajeSpinner = "Carga Inicial"
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



  showDataFlujoCaja(){
    if ( this.periodo == undefined) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }else{
    let datos = {
      //periodo: this.periodo.getFullYear(),
      periodo: this.periodo,
    };
    (this as any).mensajeSpinner ='Generando...';
    this.lcargando.ctlSpinner(true);
     console.log(datos);
    this.apiSrv.getFlujos(datos).subscribe(
      res => {
          this.reporte=res['data'];
          this.reporte.forEach(e => {
             console.log(e.ene);
          })

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
    reporte: this.reporte
  };
  console.log(this.reporte);
  (this as any).mensajeSpinner ='Guardando...';
  this.lcargando.ctlSpinner(true);
    this.apiSrv.saveFlujoCaja(datos).subscribe(
      res => {
          console.log(res);


        this.lcargando.ctlSpinner(false);
    })

    // this.vmButtons[4].habilitar = false;
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

  this.xlsService.exportReporteFlujoCaja('Flujo de Caja', rep);
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
      //periodo: Number(this.periodo.getFullYear()),
      periodo: Number(this.periodo),
      mes: Number(this.mes_actual)
    }

    this.lcargando.ctlSpinner(true);
    this.apiSrv.setEjecutarFlujoCajaSp(data).subscribe(res => {

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




}
