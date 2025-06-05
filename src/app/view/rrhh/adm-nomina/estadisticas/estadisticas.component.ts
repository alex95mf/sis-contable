import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { EstadisticasService } from './estadisticas.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/services/general.service';
import { Chart } from "chart.js";

@Component({
standalone: false,
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild('grafica') grafica: ElementRef
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  dataChart: any = [];

  lst_meses: any[] = [];
  lst_tipo_permiso: any[] = [];

  filter: any = {
    periodo: new Date(),
    mes: null,
    tipo: null,
  }
  chart: Chart;
  constructor(
    private generalService: GeneralService,
    private apiService: EstadisticasService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {orig: 'btnsRRHHEstadistica', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true},
      {orig: 'btnsRRHHEstadistica', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true},
      {orig: 'btnsRRHHEstadistica', paramAccion: '', boton: {icon: 'far fa-file-pdf', texto: 'PDF'}, clase: 'btn btn-sm btn-danger', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true},
      {orig: 'btnsRRHHEstadistica', paramAccion: '', boton: {icon: 'far fa-file-xls', texto: 'PDF'}, clase: 'btn btn-sm btn-success', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true},
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.cargaInicial()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = 'Cargando Datos Iniciales'
      const responseMes = await this.generalService.getCatalogoKeyWork('MES') as any
      console.log(responseMes)
      responseMes.data.forEach((element: any) => {
        const {id_catalogo, cat_nombre} = element
        this.lst_meses = [...this.lst_meses, {id_catalogo, cat_nombre}]
      })

      const responseTipo = await this.generalService.getCatalogoKeyWork('TPPM') as any
      console.log(responseTipo)
      responseTipo.data.forEach((element: any) => {
        const {id_catalogo, cat_nombre} = element
        this.lst_tipo_permiso = [...this.lst_tipo_permiso, {id_catalogo, cat_nombre}]
      })
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getDatosEstadisticos()
        break;
      case "LIMPIAR":
        this.clearFiltros()
        break;
      case "PDF":
        //
        break;
      case "EXCEL":
        //
        break;

      default:
        break;
    }
  }

  async getDatosEstadisticos() {
    // this.grafica.nativeElement.value = null
    //     // Resto del código
    // this.chartPie('pieChart', 'pie');
    //      this.lcargando.ctlSpinner(true)
    this.lcargando.ctlSpinner(true)
    (this as any).mensajeSpinner = 'Cargando Gráfico...'
    // // this.chartPie('pieChart', 'pie')
    Object.assign(this.filter, {fp_anio: new Date(this.filter.periodo).getFullYear()})
    const response = await this.apiService.getFaltasPermisosEmployeesReportGrafi({filter: this.filter}) as any
    // console.log(response)
    this.dataChart = []
    this.dataChart = response.data
    let lbls: string[] = [];
    let dataValues: number[] = [];
    response.data.forEach((element: any) => {
      lbls = [...lbls, element.motivo]
      dataValues = [...dataValues, element.total]

      this.dataChart = [...this.dataChart, {name: element.motivo, value: element.valor}]
    })

    if (this.chart != undefined) {
      this.chart.clear()
      this.chart.destroy()
      // console.log('ejecuta1');
    }

    setTimeout(() => {
      this.chart = this.chartPie("pieChart", "pie", lbls, dataValues);
      console.log(this.chart);
    }, 50);
  }



  clearFiltros() {
    Object.assign(this.filter, {
      periodo: new Date(),
      mes: null,
      tipo: null,
    })
  }

   chartPie(ctx:string, tipo:any, lbls: any,dataValues: any){

    this.lcargando.ctlSpinner(false)
    return new Chart(ctx, {
      type: tipo,
      data: {
        labels: lbls,
        datasets: [{
          label: '# Mensual',
          data: dataValues,
          backgroundColor: [
            // '#0F2FD0',//azul
            // '#D00F19',//rojo
            // '#0DB415',//verde
            // '#0DA3B4',//azul claro
            // '#E97C10',//naranja
            // '#6A738A',//gris
            // '#5805D5',//violeta
            // '#D5057B',//fucsia
            // '#05D54E',//verde claro
            // '#05D2D5',//aqua
            // '#F7F704',//amarillo
            // '#02626D',//plomo
            // '#FC3E0F', //rojo
            // '#7BF70E',//verde
            // '#F9CA6B',//naranja claro
            // '#5973D1',//azul claro
            // '#6664FF',//azul
            // '#CF0060',//rojo
            // '#E7C500',//verde
            // '#FFFFFF',//azul claro
            // '#CF0060',//naranja
            // '#D0CCD1',//gris
            // '#6F3460',//violeta
            // '#FE0AB7',//fucsia
            // '#2EF8A0',//verde claro
            // '#067D6B',
            // '#067D6B'
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
            // '#0F2FD0',//azul
            // '#D00F19',//rojo
            // '#0DB415',//verde
            // '#0DA3B4',//azul claro
            // '#E97C10',//naranja
            // '#6A738A',//gris
            // '#5805D5',//violeta
            // '#D5057B',//fucsia
            // '#05D54E',//verde claro
            // '#05D2D5',//aqua
            // '#F7F704',//amarillo
            // '#02626D',//plomo
            // '#FC3E0F', //rojo
            // '#7BF70E',//verde
            // '#F9CA6B',//naranja claro
            // '#5973D1',//azul claro
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
        }]
      },
      options: {
        // plugins: {
        //   tooltip: {
        //     callbacks: {
        //       title: (ttItem) => (ttItem[0].dataset.label)
        //     }
        //   }
        // },
        legend: {
          display: true
        },
        scales: {
          xAxes:[{
            display: false,
            gridLines:{
              display: false
            },
            ticks:{
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              fontColor: '#000',
              fontStyle: 'bold',
              minRotation: 45

            },
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks:{
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              fontColor: '#000',
              fontStyle: 'bold',


            },
          }],

        }
      }
    });


  }

}
