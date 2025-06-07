import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ReporteDosService } from './reporte-dos.service';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { NgSelectComponent } from '@ng-select/ng-select';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { CommonVarService } from '../../../../services/common-var.services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Chart } from 'chart.js';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ModalGruposComponent } from '../reporte-productos/modal-grupos/modal-grupos.component';
import { ListBusquedaComponent } from '../reporte-productos/list-busqueda/list-busqueda.component';

@Component({
standalone: false,
  selector: 'app-reporte-dos',
  templateUrl: './reporte-dos.component.html',
  styleUrls: ['./reporte-dos.component.scss']
})
export class ReporteDosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Análisis de Existencia';
  vmButtons: Array<Botonera> = [];
  mensajeSpinner: string = "Cargando...";

  processing: any;
  selectedReporte: any;  // Tipo Reporte
  selectedTipo: any;  // Tipo Bien
  selectedData: string;  // Data a mostrar
  selectedGrupo: any;
  selectedSubGrupo:  string;
  nombreProducto:string;
  selectedProductos:  any;
  anioIngreso: any;
  ubicacion: any;
  mostrarMatriz: boolean = true;
  nombreCustodio: any;
  viewDate: Date = new Date();
  fechaCorte: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  periodo: Date = new Date();

  verifyRestore = false;
  claseSelect: any = 0;
  codigo_grupo:any
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
  mes_actual: any = 0;
  arrayDetalles: any = []
//  arrayDetalles: any =
//  [{"chart":"grafico1","codigo_grupo_producto":"02","nombre_grupo":"MATERIALES DE ASEO","clases":[{"clase":"A","antiguedad":"30 dias","costo_total":0.00},
//  {"clase":"B","antiguedad":"60 dias","costo_total":0.00},
//  {"clase":"C","antiguedad":"90 dias","costo_total":0.00},
//  {"clase":"D","antiguedad":"120 dias","costo_total":0.00},
//  {"clase":"E","antiguedad":"> 120 dias","costo_total":37500.00}]},
//  {"chart":"grafico2","codigo_grupo_producto":"530801","nombre_grupo":"ALIMENTOS Y BEBIDAS","clases":[{"clase":"A","antiguedad":"30 dias","costo_total":1226.38},
//  {"clase":"B","antiguedad":"60 dias","costo_total":0.00},
//  {"clase":"C","antiguedad":"90 dias","costo_total":0.00},
//  {"clase":"D","antiguedad":"120 dias","costo_total":0.00},
//  {"clase":"E","antiguedad":"> 120 dias","costo_total":0.00}]},
//  {"chart":"grafico3","codigo_grupo_producto":"530802","nombre_grupo":"VESTUARIO, LENCERÍA, PRENDAS DE PROTECCION Y ACCESORIOS PARA UNIFORMES DEL PERSONAL DE PROTECCIÓN, VIGILANCIA Y SEGURIDAD","clases":[{"clase":"A","antiguedad":"30 dias","costo_total":410.00},
//  {"clase":"B","antiguedad":"60 dias","costo_total":0.00},
//  {"clase":"C","antiguedad":"90 dias","costo_total":0.00},
//  {"clase":"D","antiguedad":"120 dias","costo_total":0.00},
//  {"clase":"E","antiguedad":"> 120 dias","costo_total":0.00}]},
//  {"chart":"grafico4","codigo_grupo_producto":"530804","nombre_grupo":"MATERIALES DE OFICINA","clases":[{"clase":"A","antiguedad":"30 dias","costo_total":0.00},
//  {"clase":"B","antiguedad":"60 dias","costo_total":4409.60},
//  {"clase":"C","antiguedad":"90 dias","costo_total":560.00},
//  {"clase":"D","antiguedad":"120 dias","costo_total":64682.99},
//  {"clase":"E","antiguedad":"> 120 dias","costo_total":882294.76}]},
//  {"chart":"grafico5","codigo_grupo_producto":"730802","nombre_grupo":"VESTUARIO, LENCERÍA, PRENDAS DE PROTECCION Y ACCESORIOS PARA UNIFORMES DEL PERSONAL DE PROTECCIÓN, VIGILANCIA Y SEGURIDAD","clases":[{"clase":"A","antiguedad":"30 dias","costo_total":10799.61},
//  {"clase":"B","antiguedad":"60 dias","costo_total":0.00},
//  {"clase":"C","antiguedad":"90 dias","costo_total":0.00},
//  {"clase":"D","antiguedad":"120 dias","costo_total":0.00},
//  {"clase":"E","antiguedad":"> 120 dias","costo_total":0.00}]}]


  cmb_grupo: any[] = [];
  cmb_subgrupo: any[] = [];
  cmb_productos: [];
  cmb_grupo_filter: any[] = [];
  cmb_subgrupo_filter: any[] = [];
  cmb_productos_filter: any[] = [];



  arrayBodega: Array<any> = [];

  clases: any[] = [];

   stockList = [
    {value: "1",label: "CON STOCK"},
    {value: "2",label: "SIN STOCK"},
    {value: "0",label: "TODOS"},
  ]
  grupo_descripcion: any;
  producto_exi: any = [];

  dataProducto:any[] = [];

  chart1: Chart;
  ReportGrafiFPBarras: any;

  estadoSelected = 0
  selectedBodega = 0
  stockSelected = 0
  UserSelect: any;
  moduloUser: any = "";
  filtClient: any;
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private apiService: ReporteDosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
    private commonVarServices: CommonVarService,
    private elementRef: ElementRef
  ) {
    this.commonVarServices.selectGrupo.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);
        this.claseSelect = res

        this.grupo_descripcion = this.claseSelect['codigo_grupo_producto'] + "-" + this.claseSelect['descripcion'] + "-" + this.claseSelect['tipo_bien']
        this.selectedGrupo = this.claseSelect['id_grupo_productos']
        console.log(this.claseSelect)
      }
    )
    this.commonVarServices.selectProducto.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.producto_exi = res
        this.cmb_productos = res
        this.selectedProductos = res['id_producto']
        this.nombreProducto = res['nombre']


      }
    )


    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "PROCESAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-warning boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: true
      },
    ];
  }

  ngOnInit(): void {
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
    setTimeout(() => this.cargaInicial(), 50);
  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "PROCESAR":
        this.procesarSp()
        break;
      case "EXCEL":
        //this.exportarExcel()
        this.export();
        break;
      case "CONSULTAR":
        //this.consultarReporte()
        this.consultarReportGrafi()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Grupos'
      let response: Array<any> = await this.apiService.getGruposBienes();
      let bodegas: Array<any> = await this.apiService.getBodegas();
      this.cmb_grupo = response
      this.arrayBodega = bodegas
      this.cmb_grupo_filter = this.cmb_grupo.filter((item: any) => item.tipo_bien == 'EXI')
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }
  // asignarEstado(evt) {
  //   this.filter.estado = [evt]
  //  }



  async consultarReporte() {
   // Validar opciones seleccionadas
    // let message: string = '';
    // if (this.selectedGrupo == undefined || this.selectedGrupo == null) message += '* Debe seleccionar un Grupo.<br>';
    // if (this.selectedProductos == undefined || this.selectedProductos == null) message += '* Debe seleccionar un Producto.<br>';
    // if (this.estadoSelected == undefined || this.estadoSelected == null) message += '* Debe seleccionar un Estado.<br>';
    // if (message.length > 0) {
    //   this.toastr.warning(message, 'Advertencia', { enableHtml: true })
    //   return;
    // }


    this.lcargando.ctlSpinner(true);
    try {
      let data={
        grupo: this.selectedGrupo,
        producto: this.selectedProductos,
        bodega: this.selectedBodega,
        fecha_corte: moment(this.fechaCorte).format('YYYY-MM-DD'),
        ubicacion: this.ubicacion,
        stock: this.stockSelected,
      }

      let response = await this.apiService.getData(data);
        console.log(response)
        if(response.length > 0){
          this.dataProducto = response
        }else{
          this.dataProducto = [];
        }
        this.vmButtons[3].habilitar = false
        this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error consultando Reporte')
    }
  }

  export() {
    console.log(this.selectedSubGrupo)
    // if (this.permissions.exportar == 0) {
    //   this.toastr.warning("No tiene permisos para exportar.", this.fTitle)
    //   return
    // }
    // let grupo_producto = this.cmb_grupo.filter((item: any) => item.id_grupo_productos == this.selectedGrupo)
    // let producto = this.cmb_productos?.filter((item: any) => item.id_producto == this.selectedProductos)
    let bodega = this.arrayBodega.filter((item: any) => item.id_bodega_cab == this.selectedBodega)
    let stock = this.stockList.filter((item: any) => item.value == this.stockSelected)

    let data = {
      title: 'SALDOS DE INVENTARIO',
      // producto: producto,
      // grupo: grupo_producto[0]?.descripcion? grupo_producto[0]?.descripcion : '',
      producto: this.nombreProducto,
      grupo: this.grupo_descripcion,
      bodega:bodega[0]?.nombre,
      ubicacion:this.ubicacion,
      fecha_corte:moment(this.fechaCorte).format('YYYY-MM-DD'),
      stock: stock[0]?.label ? stock[0]?.label : '',
      rows: this.dataProducto
    }
    console.log(data);

    this.xlsService.exportReporteSaldosInventario(data, 'Reporte Saldos de Inventario')
  }

  filterProductos(event: any) {
    console.log(event);
    // console.log(this.selectedGrupo)
   //if (event != undefined && this.selectedReporte == 'PSG') {
     this.lcargando.ctlSpinner(true);
     (this as any).mensajeSpinner = 'Filtrando Productos por Grupo de Bien'
     let data={
      id_grupo: event.id_grupo_productos
     }
     this.apiService.getProductos(data).subscribe(res => {
      console.log(res['data'])
      this.cmb_productos= res['data']

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })

     this.cmb_subgrupo_filter = this.cmb_subgrupo.filter((item: any) => item.parent_id == event.id_grupo_productos)

     setTimeout(() => this.lcargando.ctlSpinner(false), 750)
  // }
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
      periodo: Number(this.periodo.getFullYear()),
      mes: Number(this.mes_actual)
    }

    this.lcargando.ctlSpinner(true);
    this.apiService.setProcesoAnalisisExi(data).subscribe(res => {
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
  uArrayClases(array) {
  var out = [];
  for (var i=0, len=array.length; i<len; i++)
      if (out.indexOf(array[i]) === -1)
          out.push(array[i]);
  return out;
}
uArrayGrupos(array) {
  var out = [];
  for (var i=0, len=array.length; i<len; i++)
      if (out.indexOf(array[i]['nombre_grupo']) === -1)
          out.push(array[i]['nombre_grupo']);
  return out;
}

 consultarReportGrafi() {

   let parameterUrl: any = {
      periodo: this.periodo.getFullYear(),
      mes: Number(this.mes_actual)
   };

   (this as any).mensajeSpinner = 'Cargando...'
   this.lcargando.ctlSpinner(true);
   this.apiService.getReporteAnalisisExistenciaGrupos(parameterUrl).subscribe((res: any) => {
   this.lcargando.ctlSpinner(false)

      console.log(res)
      console.log(res['data'][0].json_agg)

      let jsonObj = {
        datos:  JSON.parse(res['data'][0].json_agg)
      };
      let clasesArray=[];

      this.arrayDetalles = [];
      this.arrayDetalles = jsonObj.datos

      this.arrayDetalles.forEach((element, index) => {
        Object.assign(element,{ chart:'grafico'+ index})
        element.clases.forEach(c => {
          clasesArray.push(c.clase)
        })

      });
      console.log(clasesArray)


      var arrayClases = this.uArrayClases(clasesArray);
      //var arrayGrupos = this.uArrayGrupos(res['data']);

      // arrayGrupos.forEach(e => {
      //   let group = res['data'].filter(g => g.nombre_grupo == e.nombre_grupo)
      //   let array = {
      //     grupo: group
      //   }
      //   //this.clases.push(array)
      // })

      console.log(this.clases)
      this.clases = arrayClases


       console.log(arrayClases)
       //console.log(arrayGrupos)
      // let grupos = []
      // let clases = []
      // let grupoClases = []
      // res['data'].forEach(e => {
      //  let nombresFilter = this.clases.filter(f => {e.clase != f.clase})
      //  grupoClases.push(nombresFilter)
      //  this.clases.map(f => {
      //   if(e.clase == f.clase){
      //     let clase ={
      //       clase: e.clase,
      //       costo_total: e.costo_total
      //     }
      //     clases.push(clase)
      //   }
      //   if(e.clase == f.clase && e.nombre_grupo != f.nombre_grupo){
      //     let grupo={
      //       nombre_grupo:e.nombre_grupo,
      //       costo_total:e.costo_total
      //     }
      //     grupos.push(grupo)
      //   }

      //  })
      // })
      // console.log(grupoClases)
      // console.log(clases)
      // console.log(grupos)
      // const data1 = {
      //   labels: ["A", "B", "C", "D"],
      //   datasets: [{
      //     label: "Dataset 1",
      //     data: [10, 20, 15, 25],
      //     backgroundColor: "rgba(255, 99, 132, 0.2)",
      //     borderColor: "rgba(255, 99, 132, 1)",
      //     borderWidth: 1
      //   }]
      // };

      // const data2 = {
      //   labels: ["E", "F", "G", "H"],
      //   datasets: [{
      //     label: "Dataset 2",
      //     data: [5, 15, 10, 30],
      //     backgroundColor: "rgba(54, 162, 235, 0.2)",
      //     borderColor: "rgba(54, 162, 235, 1)",
      //     borderWidth: 1
      //   }]
      // };

      // const options = {
      //   scales: {
      //     y: {
      //       beginAtZero: true
      //     }
      //   }
      // };

      // // Array de objetos que contienen la configuración de los gráficos
      // const charts = [
      //   {
      //     canvasId: 'grafico1',
      //     type: 'bar', // Puedes cambiar el tipo de gráfico (bar, line, pie, etc.)
      //     data: data1,
      //     options: options
      //   },
      //   {
      //     canvasId: 'grafico2',
      //     type: 'bar',
      //     data: data2,
      //     options: options
      //   }
      //   // Puedes agregar más objetos para más gráficos
      // ];

      // charts.forEach(chart => {
      //   let canvas = this.elementRef.nativeElement.querySelector('#'+chart.canvasId);
      //   new Chart(canvas, {
      //     type: chart.type,
      //     data: chart.data,
      //     options: {
      //       // plugins: {
      //       //   tooltip: {
      //       //     callbacks: {
      //       //       title: (ttItem) => (ttItem[0].dataset.label)
      //       //     }
      //       //   }
      //       // },
      //       scales: {
      //         xAxes: [{
      //           ticks: {
      //             beginAtZero: true
      //           },

      //         }],
      //         yAxes: [{
      //           ticks: {
      //             beginAtZero: true
      //           },

      //         }]
      //       }
      //     }
      //   });
      // });


       let labelInfoBar = [];
       let DataSetGrafit = [];
       console.log(res);
       if (this.chart1 != undefined) {
         this.chart1.clear()
         this.chart1.destroy()
         console.log('ejecuta1');
       }

       for (let i = 0; i < res['data'].length; i++) {
         labelInfoBar.push(res['data'][i].clase);
       }

       /*Recorremos el elemento principal que son los  motivos */

       for (let i = 0; i < res['data'].length; i++) {


         if (DataSetGrafit.length > 0) {

           let labelGraf = DataSetGrafit.filter(co => co.nombre_grupo == res['data'][i].nombre_grupo);


           if (labelGraf.length > 0) {
             labelGraf[0]['data'].push(res['data'][i].total_costo);
           } else {

             let dataPointGrafit = []

             dataPointGrafit.push(res['data'][i].total_costo);

             DataSetGrafit.push({
               label: res['data'][i].nombre_grupo,
               backgroundColor: '#42A5F5',
               data: dataPointGrafit
             })
           }

         } else {

           let dataPointGrafit = []

           dataPointGrafit.push(res['data'][i].total_costo);

           DataSetGrafit.push({
             label: res['data'][i].nombre_grupo,
             backgroundColor: '#42A5F5',
             data: dataPointGrafit
           })
         }

         //labelInfoBar.push(res[i].mes);

       this.ReportGrafiFPBarras = {
         labels: labelInfoBar,
         datasets: DataSetGrafit
       };
       console.log(labelInfoBar, DataSetGrafit);
       //let data = DataSetGrafit.length == 0 ? [] : DataSetGrafit[0].data;
       let data = [15,25,30,56,58,96,36]
       // let label = labelInfoBar === : labelInfoBar
       setTimeout(() => {
        console.log(this.arrayDetalles)

        // this.chart1 = this.chart(this.arrayDetalles, "bar", this.clases, data);
         this.chart(this.arrayDetalles, "bar", this.clases, data);
         console.log(this.chart1);

       }, 50);



     }

   },
   (error) => {
     this.lcargando.ctlSpinner(false);
     this.processing = true;
     this.toastr.info(error.error.message);
   });
 }
 chart(name: any[], tipo: string, label: string[], data: number[]) {
  name.forEach(e =>{
    let totales =[];
    e.clases.forEach(d =>{
    totales.push(d.costo_total)

    })
    let htmlRef = this.elementRef.nativeElement.querySelector(`#`+e.chart);
    return new Chart(htmlRef, {
      type: tipo as any,
      data: {
        labels: label,
        datasets: [{
          label: 'T',
          data: totales,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(146, 79, 44, 0.8)',
            'rgba(144, 169, 26, 0.8)',
            'rgba(26, 169, 120, 0.8)',
            'rgba(6, 117, 134, 0.8)',
            'rgba(109, 47, 127, 0.8)',
            'rgba(119, 37, 103, 0.8)',
            'rgba(37, 77, 119, 0.8)',
            'rgba(245, 39, 145, 0.17)',
            'rgba(165, 39, 245, 0.17)',
            'rgba(39, 245, 71, 0.17)',
            'rgba(8, 104, 23, 0.52)',
            'rgba(121, 183, 3, 0.52)',
            'rgba(183, 143, 3, 0.52)',
            'rgba(212, 132, 17, 0.52)',
            'rgba(212, 17, 68, 0.52)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(144, 169, 26, 0.8)',
            'rgba(26, 169, 120, 0.8)',
            'rgba(6, 117, 134, 0.8)',
            'rgba(109, 47, 127, 0.8)',
            'rgba(119, 37, 103, 0.8)',
            'rgba(37, 77, 119, 0.8)',
            'rgba(245, 39, 145, 0.17)',
            'rgba(165, 39, 245, 0.17)',
            'rgba(39, 245, 71, 0.17)',
            'rgba(8, 104, 23, 0.52)',
            'rgba(121, 183, 3, 0.52)',
            'rgba(183, 143, 3, 0.52)',
            'rgba(212, 132, 17, 0.52)',
            'rgba(212, 17, 68, 0.52)'
          ],
          borderWidth: 1
        },


      ]
      },
      options: {
        legend: {
          display: false
        },

      }
      // options: {
      //   // plugins: {
      //   //   tooltip: {
      //   //     callbacks: {
      //   //       title: (ttItem) => (ttItem[0].dataset.label)
      //   //     }
      //   //   }
      //   // },
      //   plugins: {
      //     legend: {

      //       display: false,
      //     },
      //     title: {
      //       display: false,

      //     },
      //   },
      //   scales: {
      //     xAxes: [{
      //       ticks: {
      //         beginAtZero: true
      //       },

      //     }],
      //     yAxes: [{
      //       ticks: {
      //         beginAtZero: true
      //       },

      //     }]
      //   }
      // }
    });
  })


  console.log(data);







    }

  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick());
    this.anioIngreso= ''
    this.UserSelect=undefined
    this.vmButtons[3].habilitar = true
    this.cmb_grupo = [];
    this.cmb_productos = [];
    this.cmb_grupo_filter = [];
    this.dataProducto = [];
    this.stockSelected = 0
    this.selectedBodega = 0
    this.selectedGrupo = ''
    this.ubicacion = ''
    this.fechaCorte = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.grupo_descripcion = ''

    this.producto_exi = [];
    this.selectedProductos = ''
    this.nombreProducto = ''
  }
  modalGrupos() {
    this.lcargando.ctlSpinner(false)

    let modal = this.modalService.open(ModalGruposComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;

  }
  expandProductos() {

    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })

    modal.componentInstance.claseSelect = this.claseSelect
    modal.componentInstance.verifyRestore = this.verifyRestore;
  }

}
