import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  PieController
} from 'chart.js';
import { Socket } from '../../services/socket.service';
import { DashboardService } from './dashboard.service';
import { transition } from '@angular/animations';
import { CommonService } from 'src/app/services/commonServices';

// Registrar todos los componentes necesarios de Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  PieController
);

@Component({
standalone: false,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('preview', { static: false }) preview: ElementRef<HTMLImageElement>;
  @ViewChild('previewContainer', { static: false }) previewContainer: ElementRef<HTMLDivElement>;

  /* current params */
  userPayload: any;

  emisionTitulos: any;
  recaudacion: any;
  desembolsos: any;

  constructor(
    private socket: Socket,
    private service: DashboardService,
    private commonService: CommonService,
    ) {
  }

  ngOnInit() {
    this.userPayload = JSON.parse(localStorage.getItem('Datauser'));

    if (this.preview && this.previewContainer) {
      console.log('Elementos ViewChild definidos:', this.preview, this.previewContainer);
    } else {
      console.log('Elementos ViewChild no definidos');
    }
    setTimeout(() => {
      this.getData()
    }, 100);
  }

  getData(){
    let dat = {
      date: new Date().getFullYear()
    }
    console.log(dat);
    this.service.getData(dat).subscribe(
      (res)=>{
        console.log(res);
        this.emisionTitulos = res['data']['emisionTitulo']['total'];
        let {meses, valores: emVal, nombres: nombre,currency: curr} = res['data']['emisionTitulo']['grafico1'];
        let {conceptos,valores: pieVal,nombres,currency } = res['data']['emisionTitulo']['grafico2'];
        let chartLine = this.chartLine("chartLine", "line",meses, emVal,nombre,curr );
        let chartPie = this.chartPie("chattPie","pie", conceptos, pieVal, nombres,currency);

        // Grafico de recaudacion
        this.recaudacion = res['data']['recaudacion']['total'];
        let {meses: recaMes, valores: recaVal,nombres: nombr,currency: curre} = res['data']['recaudacion']['grafico1'];
        let {conceptos: recaConcep,valores: recaPieVal, nombres: nomb, currency: curren} = res['data']['recaudacion']['grafico2'];
        // Cambiar 'horizontalBar' por 'bar' con indexAxis: 'y'
        let chartLine1 = this.chart("chartLine1", "bar", recaMes, recaVal,nombr,curre, true);
        let chartPie1 = this.chartPie("chattPie1","pie",recaConcep , recaPieVal, nomb,curren);

        // Grafico de Desembolso
        this.desembolsos = res['data']['desembolso']['total'];
        let {meses: desmMes, valores: desemVal,nombres: nombresM, currency: currencyM} = res['data']['desembolso']['grafico1'];
        let {conceptos: desemConcept, valores: desemConVal,nombres: nom,currency: currenc} = res['data']['desembolso']['grafico2'];
        let chartLine2 = this.chartBar("chartLine2", "bar", desmMes, desemVal,nombresM,currencyM);
        let chartPie2 = this.chartPie("chattPie2","pie", desemConcept, desemConVal,nom,currenc);
      }
    )
  }

  chart(name:string, tipo:string, label: string[], data: number[],nombres:string,currency: string, isHorizontal: boolean = false){
    const config: any = {
      type: tipo,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
          backgroundColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1'
          ],
          borderColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                let label: any = '';
                if (nombres && nombres.length > context.dataIndex) {
                  label += '' + nombres[context.dataIndex];
                }
                if (currency && currency.length > context.dataIndex) {
                  label += ': ' + currency[context.dataIndex];
                }
                return label;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#505050',
              maxRotation: 45,
              callback: isHorizontal ? function(value: any, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              } : undefined
            },
            title: {
              display: true,
              text: isHorizontal ? 'Monto' : 'Meses',
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000000'
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
              color: '#000000',
              callback: !isHorizontal ? function(value: any, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              } : undefined
            },
            title: {
              display: true,
              text: isHorizontal ? 'Meses' : 'Monto',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000'
            }
          }
        }
      }
    };

    // Si es barra horizontal, agregar indexAxis
    if (isHorizontal) {
      config.options.indexAxis = 'y';
    }

    return new Chart(name, config);
  }

  chartLine(name:string, tipo:string, label: string[], data: number[], nombres: string, currency: string){
    return new Chart(name, {
      type: tipo as any,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          fill: false,
          tension: 0.1, // Cambio de lineTension a tension
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
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
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                let label: any = '';
                if (nombres && nombres.length > context.dataIndex) {
                  label += '' + nombres[context.dataIndex];
                }
                if (currency && currency.length > context.dataIndex) {
                  label += ': ' + currency[context.dataIndex];
                }
                return label;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000000',
              maxRotation: 45
            },
            title: {
              display: true,
              text: 'Meses',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000'
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
              callback: function(value: any, index, values) {
                if(parseInt(value) >= 1000){
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
              color: '#000000'
            }
          }
        }
      }
    });
  }

  chartBar(name:string, tipo:string, label: string[], data: number[],nombres: string, currency:string){
    return new Chart(name, {
      type: tipo as any,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
          backgroundColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1'
          ],
          borderColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                let label: any = '';
                if (nombres && nombres.length > context.dataIndex) {
                  label += '' + nombres[context.dataIndex];
                }
                if (currency && currency.length > context.dataIndex) {
                  label += ': ' + currency[context.dataIndex];
                }
                return label;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category',
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000000',
              maxRotation: 45
            },
            title: {
              display: true,
              text: 'Meses',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#000000'
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
              callback: function(value: any, index, values) {
                if(parseInt(value) >= 1000){
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
              color: '#000000'
            }
          }
        }
      }
    });
  }

  chartPie(name:string, tipo:string, label: string[], data: number[],nombres: string, currency: string){
    console.log(data);
    console.log(nombres);

    return new Chart(name, {
      type: tipo as any,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          data: data,
          backgroundColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1','#6664FF','#CF0060',
            '#E7C500','#FFFFFF','#CF0060','#D0CCD1','#6F3460','#FE0AB7',
            '#2EF8A0','#067D6B','#067D6B'
          ],
          borderColor: [
            '#0F2FD0','#D00F19','#0DB415','#0DA3B4','#E97C10','#6A738A',
            '#5805D5','#D5057B','#05D54E','#05D2D5','#F7F704','#02626D',
            '#FC3E0F','#7BF70E','#F9CA6B','#5973D1'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                let label: any = '';
                if (context.label) {
                  label = context.label;
                }
                if (nombres && nombres.length > context.dataIndex) {
                  label += '-' + nombres[context.dataIndex];
                }
                if (currency && currency.length > context.dataIndex) {
                  label += ': ' + currency[context.dataIndex];
                }
                return label;
              }
            }
          },
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
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000',
              maxRotation: 45
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10,
                weight: 'bold'
              },
              color: '#000'
            }
          }
        }
      }
    });
  }

  previewFile(event: any) {
    const file = event.target.files[0];

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.preview.nativeElement.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const docxData = event.target.result;
        const blob = new Blob([docxData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = 'https://docs.google.com/gview?url=' + encodeURIComponent(URL.createObjectURL(blob)) + '&embedded=true';
        this.preview.nativeElement.src = url;
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/dif') {
      alert('No se puede previsualizar archivos .dif');
    } else {
      alert('Formato de archivo no compatible');
    }

    this.previewContainer.nativeElement.style.display = 'block';
  }

  formatNumberDos(params: any) {
    let locality = 'en-EN';
    params = parseFloat(params).toLocaleString(locality, {
      minimumFractionDigits: 2
    });
    return params;
  }
}
