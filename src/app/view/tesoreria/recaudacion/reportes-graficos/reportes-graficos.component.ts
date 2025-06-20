import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ReportesGraficosService } from './reportes-graficos.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';

// Importaciones requeridas para Chart.js v4
import {
  Chart,
  ChartConfiguration,
  ChartType,
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js v4
Chart.register(
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  standalone: false,
  selector: 'app-reportes-graficos',
  templateUrl: './reportes-graficos.component.html',
  styleUrls: ['./reportes-graficos.component.scss']
})
export class ReportesGraficosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Reportes Gráficos de Reacaudación ";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  conceptos: any[] = [];
  reportes: any[] = [];

  recaudacion: any;
  recaudacionAnio: any;
  recaudacionMes: any;

  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filterAnios: any;
  filterMeses: any;

  periodo: Date = new Date();
  desde: Date = new Date();
  hasta: Date = new Date();
  chartLine1: Chart;
  chartLine2: Chart;

  constructor(
    private apiService: ReportesGraficosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {

  }

  ngOnInit(): void {
    this.vmButtons = [];

    this.filterMeses = {
      desde: moment().startOf('month').format('YYYY-MM-DD'),
      hasta: moment().endOf('month').format('YYYY-MM-DD'),
    }
    this.filterAnios = {
      periodo: moment().startOf('month').format('YYYY-MM-DD'),
    }

    setTimeout(() => {
      this.getDataAnios()
      this.getDataMeses()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "PDF":
        // this.mostrarReporte()
        break;
      case "EXCEL":
        //this.btnExportarExcel()
        break;
      default:
        break;
    }
  }

  getDataAnios() {
    let dat = {
      date_desde: Number(this.desde.getFullYear()),
      date_hasta: Number(this.hasta.getFullYear()),
    }

    console.log(dat);
    this.apiService.getDataRecAnios(dat).subscribe(
      (res) => {
        console.log(res);
        if (this.chartLine1 != undefined) {
          this.chartLine1.clear()
          this.chartLine1.destroy()
          console.log('ejecuta1');
        }

        this.recaudacionAnio = undefined
        this.recaudacionAnio = res['data']['recaudacionanio']['grafico2'];
        let { anios: recaAnio, valores: recaanioVal } = this.recaudacionAnio;
        let tipo = 'Años';

        setTimeout(() => {
          this.chartLine1 = this.chartBar("chartLine1", "bar", recaAnio, recaanioVal, tipo);
          console.log(this.chartLine1);
        }, 50);
      }
    )
  }

  getDataMeses() {
    let dat = {
      date: Number(this.periodo.getFullYear()),
    }

    this.apiService.getDataRecMeses(dat).subscribe(
      (res) => {
        console.log(res);
        if (this.chartLine2 != undefined) {
          this.chartLine2.clear()
          this.chartLine2.destroy()
          console.log('ejecuta1');
        }

        this.recaudacionMes = undefined
        this.recaudacionMes = res['data']['recaudacion']['grafico1'];
        let { meses: recaMes, valores: recaVal } = this.recaudacionMes;
        let tipo = 'Meses';

        setTimeout(() => {
          this.chartLine2 = this.chartBar("chartLine2", "bar", recaMes, recaVal, tipo);
          console.log(this.chartLine2);
        }, 50);
      }
    )
  }

  limpiarFiltrosAnios() {
    this.filterAnios = {
      desde: moment().startOf('month').format('YYYY-MM-DD'),
      hasta: moment().endOf('month').format('YYYY-MM-DD'),
    }
  }

  limpiarFiltrosMeses() {
    this.filterMeses = {
      periodo: moment().startOf('month').format('YYYY-MM-DD'),
    }
  }

  chart(name: string, tipo: string, label: string[], data: number[]): Chart {
    const config: ChartConfiguration = {
      type: tipo as ChartType,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
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
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            // beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#505050',
              minRotation: 45,
              callback: function (value: any, index, values) {
                if (parseInt(value) >= 1000) {
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            },
            title: {
              display: true,
              text: 'Monto',
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000000',
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
              font: {
                size: 11,
                weight: 'bold'
              },
              padding: 0,
              color: '#000000',
            },
            title: {
              display: true,
              text: 'Meses',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000',
            }
          }
        }
      }
    };

    return new Chart(name, config);
  }

  chartLine(name: string, tipo: string, label: string[], data: number[]): Chart {
    const config: ChartConfiguration = {
      type: tipo as ChartType,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          fill: false,
          tension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            // beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000000',
              minRotation: 45
            },
            title: {
              display: true,
              text: 'Meses',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000',
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000000',
              callback: function (value: any, index, values) {
                if (parseInt(value) >= 1000) {
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            },
            title: {
              display: true,
              text: 'Monto',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000',
            }
          }
        }
      }
    };

    return new Chart(name, config);
  }

  chartBar(name: string, tipo: string, label: string[], data: number[], tipo_grafico: string): Chart {
    let htmlRef = undefined
    if (name == 'chartLine1') {
      htmlRef = this.elementRef.nativeElement.querySelector(`#chartLine1`);
    }
    if (name == 'chartLine2') {
      htmlRef = this.elementRef.nativeElement.querySelector(`#chartLine2`);
    }

    const config: ChartConfiguration = {
      type: tipo as ChartType,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
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
            'rgba(6, 117, 134, 0.4)',
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
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            // beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000000',
              minRotation: 45
            },
            title: {
              display: true,
              text: tipo_grafico,
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000',
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000000',
              callback: function (value: any, index, values) {
                if (parseInt(value) >= 1000) {
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            },
            title: {
              display: true,
              text: 'Monto',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000',
            }
          }
        }
      }
    };

    return new Chart(htmlRef, config);
  }

  chartPie(name: string, tipo: string, label: string[], data: number[]): Chart {
    const config: ChartConfiguration = {
      type: tipo as ChartType,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
          backgroundColor: [
            '#0F2FD0',//azul
            '#D00F19',//rojo
            '#0DB415',//verde
            '#0DA3B4',//azul claro
            '#E97C10',//naranja
            '#6A738A',//gris
            '#5805D5',//violeta
            '#D5057B',//fucsia
            '#05D54E',//verde claro
            '#05D2D5',//aqua
            '#F7F704',//amarillo
            '#02626D',//plomo
            '#FC3E0F', //rojo
            '#7BF70E',//verde
            '#F9CA6B',//naranja claro
            '#5973D1',//azul claro
            '#6664FF',//azul
            '#CF0060',//rojo
            '#E7C500',//verde
            '#FFFFFF',//azul claro
            '#CF0060',//naranja
            '#D0CCD1',//gris
            '#6F3460',//violeta
            '#FE0AB7',//fucsia
            '#2EF8A0',//verde claro
            '#067D6B',
            '#067D6B'
          ],
          borderColor: [
            '#0F2FD0',//azul
            '#D00F19',//rojo
            '#0DB415',//verde
            '#0DA3B4',//azul claro
            '#E97C10',//naranja
            '#6A738A',//gris
            '#5805D5',//violeta
            '#D5057B',//fucsia
            '#05D54E',//verde claro
            '#05D2D5',//aqua
            '#F7F704',//amarillo
            '#02626D',//plomo
            '#FC3E0F', //rojo
            '#7BF70E',//verde
            '#F9CA6B',//naranja claro
            '#5973D1',//azul claro
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false
            },
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000',
              minRotation: 45
            },
          },
          y: {
            display: false,
            grid: {
              display: false
            },
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 0,
              color: '#000',
            },
          },
        }
      }
    };

    return new Chart(name, config);
  }
}
