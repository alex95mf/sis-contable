import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FlujoEfectivoService } from './flujo-efectivo.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';


@Component({
standalone: false,
  selector: 'app-flujo-efectivo',
  templateUrl: './flujo-efectivo.component.html',
  styleUrls: ['./flujo-efectivo.component.scss']
})
export class FlujoEfectivoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Flujo de Efectivo";
  mensajeSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  reporte: any =[]
  selectedReporte: any = undefined;


 
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any;
  paginate: any;
  periodo: any = new Date();
  mes_actual: any = 0;
 
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
  cmb_periodo: any[] = []
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
  constructor(
    private apiService: FlujoEfectivoService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
  ) {
   }

  ngOnInit(): void {

    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
    this.vmButtons = [
     
      {
        orig: "btnsFlujoEfectivo",
        paramAccion: "",
        boton: { icon: "far fa-file-search", texto: "PROCESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFlujoEfectivo",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      { 
        orig: "btnsFlujoEfectivo", 
        paramAccion: "", 
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: true
      },
      { 
        orig: "btnsFlujoEfectivo", 
        paramAccion: "", 
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-warning boton btn-sm", 
        habilitar: false
      },
    ];
    

    this.filter = {
      concepto: '',
      codigo: 'TODOS',
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: '',
      tasa: '',
      id_tasa:null,
      codigo_tasa: '',
      cuenta_contable: ''

    }
    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10,20,50,100,500,1000]
    }

    this.periodo =  moment().format('YYYY');

    // setTimeout(() => {
    // // this.cargarConsulta()
    // }, 75)
    setTimeout(async () => {
      await this.cargaInicial()
    }, 10);
  }
  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; } 

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "PROCESAR":
        this.procesarSp()
        break;
      case "CONSULTAR":
        this.cargarConsulta()
        break;
      case "EXCEL":
      this.getDataExportar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
          break;
      default:
        break;
    }
  }

  async cargaInicial() {
    try {
      this.mensajeSpinner = "Carga Inicial"
      const resPeriodos = await this.apiService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConsulta();
  }

  periodoSelected(evt: any, year:any){
    this.periodo = evt
  }
  // cargarConsulta(){

  //   this.mensajeSpinner = 'Cargando...';
  //   this.lcargando.ctlSpinner(true);
  //   let data= {
  //     params: {
  //       filter: this.filter,
  //       paginate: this.paginate,
  //       id_componente: myVarGlobals.fContribuyente,
  //       periodo: this.periodo.getFullYear(),
  //       mes: this.mes_actual
  //     }
  //   }


  //   this.apiService.getFlujoEfectivo(data).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       if(res.data.length>0){
  //        //this.dataCobros = res.data
  //        this.paginate.length = res.data.total;
  //        this.dataFlujoEfectivo = res.data;
  //          if (res.data.current_page == 1) {
  //            this.dataFlujoEfectivo = res.data;
  //          } else {
  //            this.dataFlujoEfectivo = Object.values(res.data);
  //          }
  //        this.lcargando.ctlSpinner(false);
  //       }
  //       else{
  //        this.dataFlujoEfectivo =[]
  //        this.lcargando.ctlSpinner(false);
  //       }
       
  //     },
  //     (err: any) => {
  //       console.log(err);
  //       this.lcargando.ctlSpinner(false);
  //     }
  //   )
    
  // }

  cargarConsulta(){
    if ( this.periodo == undefined) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }else{
    let datos = {
      //periodo: this.periodo.getFullYear(),
      periodo: this.periodo,
    };
    this.mensajeSpinner ='Generando...';
    this.lcargando.ctlSpinner(true);
     console.log(datos);
    this.apiService.getFlujoEfectivo(datos).subscribe(
      res => {
        console.log(res)
          if(res['data'].length == 0 ){
            this.toastr.info('No se encontraron registros para este período');
          }else{
            this.reporte=res['data'];
            this.reporte.forEach(e => {
               console.log(e.ene);
            })
            this.lcargando.ctlSpinner(false);
          }
          
        
    })
    this.vmButtons[0].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;
  }
}

  procesarSp(){
    if(this.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(this.mes_actual==undefined || this.mes_actual=='' || this.mes_actual==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{
  
      let data = {
        //periodo: Number(this.periodo.getFullYear()),
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    
      this.lcargando.ctlSpinner(true);
      this.apiService.procesarSp(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
   }
  limpiarFiltros() {
    this.filter= {
      // concepto: '',
      // codigo: 'TODOS',
      // fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      // fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      // razon_social: '',
      // num_documento: '',
      // estado: '',
      // tasa: '',
      // id_tasa:null,
      // codigo_tasa: '',
      // cuenta_contable: ''
    }
    this.vmButtons[2].habilitar = true;

    this.reporte =[]
    this.periodo = moment().format('YYYY');
}



//  btnExportarExcel() {

//   let data = {
//     title: 'Flujo Efectivo',
//     rows:  this.reporte
//   }
//   console.log(data)

//   this.xlsService.exportFlujoEfectivo(data, 'Flujo Efectivo')
// }
getDataExportar() {
  let rep = []
  let data = {
    title: '',
  }
  let nombre='CUENTA';
  let descripcion='CONCEPTO';
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
      'CUENTA': e.nombre,
      'CONCEPTO': e.descripcion,
      'ENE': e.ene,
      'FEB': e.feb,
      'MAR': e.mar,
      'ABR':  e.abr,
      'MAY': e.may,
      'JUN': e.jun,
      'JUL': e.jul,
      'AGO': e.ago,
      'SEP': e.sep,
      'OCT': e.oct,
      'NOV': e.nov,
      'DIC': e.dic,
      'TOTAL': e.total,
    }
    rep.push(data1)
  })
  data['rep'] = rep
  console.log( data['rep']);
  console.log(rep)

  this.titles = [nombre,descripcion,enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre,total];


  //this.exportAsXLSX(rep, 'Proyeccion de Gastos',{ header: this.titles });

  this.xlsService.exportFlujoEfectivo('Flujo de Efectivo', rep);
}

 

}
