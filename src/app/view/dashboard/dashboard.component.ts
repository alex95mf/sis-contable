import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { Chart } from 'chart.js';
import { Socket } from '../../services/socket.service';
import { DashboardService } from './dashboard.service';
import { transition } from '@angular/animations';
import { CommonService } from 'src/app/services/commonServices';

@Component({
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
        // let valores1 = res['data']['grafico1']['valores'];
        let {conceptos,valores: pieVal,nombres,currency } = res['data']['emisionTitulo']['grafico2'];
        // let valores2 = res['data']['grafico2']['valores'];
        let chartLine = this.chartLine("chartLine", "line",meses, emVal,nombre,curr );
        let chartPie = this.chartPie("chattPie","pie", conceptos, pieVal, nombres,currency);

        // Grafico de recaudacion
        this.recaudacion = res['data']['recaudacion']['total'];
        let {meses: recaMes, valores: recaVal,nombres: nombr,currency: curre} = res['data']['recaudacion']['grafico1'];
        // let valores1 = res['data']['grafico1']['valores'];
        let {conceptos: recaConcep,valores: recaPieVal, nombres: nomb, currency: curren} = res['data']['recaudacion']['grafico2'];
        let chartLine1 = this.chart("chartLine1", "horizontalBar", recaMes, recaVal,nombr,curre);
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
  

  chart(name:string, tipo:string, label: string[], data: number[],nombres:string,currency: string){
    
    return  new Chart(name, {
      type: tipo,
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
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(146, 79, 44, 0.8)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
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
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
          ],
          borderWidth: 1
        }]
      },
      options: {
          tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    let label:any = '';
                    // if (data.labels && data.labels.length > tooltipItem.index) {
                    //     label = data.labels[tooltipItem.index];
                    // }
                    if (nombres && nombres.length > tooltipItem.index) {
                        label += '' + nombres[tooltipItem.index];
                    }
                     if (currency && currency.length > tooltipItem.index) {
                        label += ': ' + currency[tooltipItem.index];
                    }
                    return label;
                }
            }
        },
        // plugins: {
        //   tooltip: {
        //     callbacks: {
        //       title: (ttItem) => (ttItem[0].dataset.label)
        //     }
        //   }
        // },
         
        legend: {
          display: false
        },
        
        
        scales: {
          xAxes:[{
            ticks:{
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              fontColor: '#505050',
              fontStyle: 'bold',
              minRotation: 45,
              callback: function(value:any, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
              
            },
            scaleLabel: {
              display: true,
              labelString: 'Monto',
              fontSize: 10,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          },
          
        ],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 11,
              padding: 0,
              //fontColor: '#000',
              fontStyle: 'bold',
              fontColor: '#000000',
            
            },
            scaleLabel: {
              display: true,
              labelString: 'Meses',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          }]
        },
        
        
      }
    });
  }
  chartLine(name:string, tipo:string, label: string[], data: number[], nombres: string, currency: string){
    
    return  new Chart(name, {
      type: tipo,
      data: {
        labels: label,
        datasets: [{
          label: '# Mensual',
          fill: false,
          lineTension: 0.1,
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
          // backgroundColor: [
          //   '#0F2FD0',//azul
          //   '#D00F19',//rojo
          //   '#0DB415',//verde
          //   '#0DA3B4',//azul claro
          //   '#E97C10',//naranja
          //   '#6A738A',//gris
          //   '#5805D5',//violeta
          //   '#D5057B',//fucsia
          //   '#05D54E',//verde claro
          //   '#05D2D5',//aqua
          //   '#F7F704',//amarillo
          //   '#02626D',//plomo
          //   '#FC3E0F', //rojo
          //   '#7BF70E',//verde
          //   '#F9CA6B',//naranja claro
          //   '#5973D1',//azul claro
          //   // 'rgba(255, 99, 132, 0.2)',
          //   // 'rgba(54, 162, 235, 0.2)',
          //   // 'rgba(255, 206, 86, 0.2)',
          //   // 'rgba(75, 192, 192, 0.2)',
          //   // 'rgba(153, 102, 255, 0.2)',
          //   // 'rgba(146, 79, 44, 0.8)',
          //   // 'rgba(144, 169, 26, 0.8)',
          //   // 'rgba(26, 169, 120, 0.8)',
          //   // 'rgba(6, 117, 134, 0.8)',
          //   // 'rgba(109, 47, 127, 0.8)',
          //   // 'rgba(119, 37, 103, 0.8)',
          //   // 'rgba(37, 77, 119, 0.8)',
          //   // 'rgba(245, 39, 145, 0.17)',
          //   // 'rgba(165, 39, 245, 0.17)',
          //   // 'rgba(39, 245, 71, 0.17)',
          //   // 'rgba(8, 104, 23, 0.52)',
          //   // 'rgba(121, 183, 3, 0.52)',
          //   // 'rgba(183, 143, 3, 0.52)',
          //   // 'rgba(212, 132, 17, 0.52)',
          //   // 'rgba(212, 17, 68, 0.52)'
          // ],
          
          // borderColor: [
          //   '#0F2FD0',//azul
          //   '#D00F19',//rojo
          //   '#0DB415',//verde
          //   '#0DA3B4',//azul claro
          //   '#E97C10',//naranja
          //   '#6A738A',//gris
          //   '#5805D5',//violeta
          //   '#D5057B',//fucsia
          //   '#05D54E',//verde claro
          //   '#05D2D5',//aqua
          //   '#F7F704',//amarillo
          //   '#02626D',//plomo
          //   '#FC3E0F', //rojo
          //   '#7BF70E',//verde
          //   '#F9CA6B',//naranja claro
          //   '#5973D1',//azul claro
          //   // 'rgba(255, 99, 132, 1)',
          //   // 'rgba(54, 162, 235, 1)',
          //   // 'rgba(255, 206, 86, 1)',
          //   // 'rgba(75, 192, 192, 1)',
          //   // 'rgba(153, 102, 255, 1)',
          //   // 'rgba(255, 159, 64, 1)',
          //   // 'rgba(144, 169, 26, 0.8)',
          //   // 'rgba(26, 169, 120, 0.8)',
          //   // 'rgba(6, 117, 134, 0.8)',
          //   // 'rgba(109, 47, 127, 0.8)',
          //   // 'rgba(119, 37, 103, 0.8)',
          //   // 'rgba(37, 77, 119, 0.8)',
          //   // 'rgba(245, 39, 145, 0.17)',
          //   // 'rgba(165, 39, 245, 0.17)',
          //   // 'rgba(39, 245, 71, 0.17)',
          //   // 'rgba(8, 104, 23, 0.52)',
          //   // 'rgba(121, 183, 3, 0.52)',
          //   // 'rgba(183, 143, 3, 0.52)',
          //   // 'rgba(212, 132, 17, 0.52)',
          //   // 'rgba(212, 17, 68, 0.52)'
          // ],
          borderWidth: 1
        }]
      },
      options: {
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  let label:any = '';
                  // if (data.labels && data.labels.length > tooltipItem.index) {
                  //     label = data.labels[tooltipItem.index];
                  // }
                  if (nombres && nombres.length > tooltipItem.index) {
                      label += '' + nombres[tooltipItem.index];
                  }
                   if (currency && currency.length > tooltipItem.index) {
                      label += ': ' + currency[tooltipItem.index];
                  }
                  return label;
              }
          }
      },
        // plugins: {
        //   tooltip: {
        //     callbacks: {
        //       title: (ttItem) => (ttItem[0].dataset.label)
        //     }
        //   }
        // },
         
        legend: {
          display: false
        },
        
        
        scales: {
          xAxes:[{
            ticks:{
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              fontColor: '#000000',
              fontStyle: 'bold',
              minRotation: 45
              
            },
            scaleLabel: {
              display: true,
              labelString: 'Meses',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              //fontColor: '#000',
              fontStyle: 'bold',
              callback: function(value:any, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Monto',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          }]
        }
      }
    });
  }
  chartBar(name:string, tipo:string, label: string[], data: number[],nombres: string, currency:string){
    
    return  new Chart(name, {
      type: tipo,
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
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(146, 79, 44, 0.8)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
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
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  let label:any = '';
                  // if (data.labels && data.labels.length > tooltipItem.index) {
                  //     label = data.labels[tooltipItem.index];
                  // }
                  if (nombres && nombres.length > tooltipItem.index) {
                      label += '' + nombres[tooltipItem.index];
                  }
                   if (currency && currency.length > tooltipItem.index) {
                      label += ': ' + currency[tooltipItem.index];
                  }
                  return label;
              }
          }
      },
        // plugins: {
        //   tooltip: {
        //     callbacks: {
        //       title: (ttItem) => (ttItem[0].dataset.label)
        //     }
        //   }
        // },
         
        legend: {
          display: false
        },
        
        
        scales: {
          xAxes:[{
            ticks:{
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              fontColor: '#000000',
              fontStyle: 'bold',
              minRotation: 45
              
            },
            scaleLabel: {
              display: true,
              labelString: 'Meses',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              padding: 0,
              //fontColor: '#000',
              fontStyle: 'bold',
              callback: function(value:any, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Monto',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000000',
            }
            
          }]
        }
      }
    });
  }

  chartPie(name:string, tipo:string, label: string[], data: number[],nombres: string, currency: string){
    console.log(data)
    console.log(nombres)
    return  new Chart(name, {
      type: tipo,
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
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(146, 79, 44, 0.8)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
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
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
            // 'rgba(144, 169, 26, 0.8)',
            // 'rgba(26, 169, 120, 0.8)',
            // 'rgba(6, 117, 134, 0.8)',
            // 'rgba(109, 47, 127, 0.8)',
            // 'rgba(119, 37, 103, 0.8)',
            // 'rgba(37, 77, 119, 0.8)',
            // 'rgba(245, 39, 145, 0.17)',
            // 'rgba(165, 39, 245, 0.17)',
            // 'rgba(39, 245, 71, 0.17)',
            // 'rgba(8, 104, 23, 0.52)',
            // 'rgba(121, 183, 3, 0.52)',
            // 'rgba(183, 143, 3, 0.52)',
            // 'rgba(212, 132, 17, 0.52)',
            // 'rgba(212, 17, 68, 0.52)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // tooltips: {
        //   enabled: false,
        // },
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  let label:any = '';
                  if (data.labels && data.labels.length > tooltipItem.index) {
                      label = data.labels[tooltipItem.index];
                  }
                  if (nombres && nombres.length > tooltipItem.index) {
                      label += '-' + nombres[tooltipItem.index];
                  }
                   if (currency && currency.length > tooltipItem.index) {
                      label += ': ' + currency[tooltipItem.index];
                  }
                  // if (data.datasets && data.datasets.length > 0 && data.datasets[tooltipItem.datasetIndex].data) {
                  //   let locality = 'en-EN'; 
                  //   let valor:any = 0
                  //   valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString(locality, {
                  //     minimumFractionDigits: 2,
                  //     maximumFractionDigits: 2
                  //   })
                   
                  //   label += ': ' + valor;
                  //     //label += ': ' +(this.commonService.formatNumberDos(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 100).toFixed(2))
                  // }
                  return label;
              }
          }
      },
        // tooltips: {
        //   enabled: false,
        //   callbacks: {
        //     label: function(tooltipItem, data) {
        //       let label:any = '';
        //       if (data.labels && data.labels.length > tooltipItem.index) {
        //           label = data.labels[tooltipItem.index];
        //       }
        //       if (nombres && nombres.length > tooltipItem.index) {
        //           label += ': ' + nombres[tooltipItem.index];
        //       }
        //       // if (data.datasets && data.datasets.length > 0 && data.datasets[tooltipItem.datasetIndex].data) {
        //       //     label += ': ' + (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 100).toFixed(2) + '%';
        //       // }
        //       return label;
        //     }
        //   }
        // },
         
      //   plugins: {
      //     tooltip: {
      //         callbacks: {
      //             label: function(context) {
      //                 var label = context.label || '';

      //                 if (label) {
      //                     label += ': ';
      //                 }
      //                 label += nombres[context.dataIndex]; // Mostrar el nombre correspondiente al índice del dato
      //                 return label;
      //             }
      //         }
      //     }
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
    //previewContainer.style.display = 'block';
  }

  formatNumberDos(params) {
    let locality = 'en-EN';
    params = parseFloat(params).toLocaleString(locality, {
      minimumFractionDigits: 2
    })
    // params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }
  
}