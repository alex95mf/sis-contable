import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { DashboardService } from './dashboard.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  periodos: Array<any>;
  fTitle: any = "Dashboard Planificación";
  dataUser: any;
  permissions: any;
  empresLogo: any;
  vmButtons: any = [];

  colorSchemeCharts = [
    {domain: ['#000099', '#E5E5F4']},
    {domain: ['#D22E2E', '#E6A5A6']},
    {domain: ['#378D3B', '#A8CBAC']}
  ];

  colorSchemeChartsBar = {
    domain: [
      '#000099','#D22E2E','#378D3B',
    ]
  }
  
  presupuesto = { periodo: new Date().getFullYear() + 1 }
  programas = [];
  departamentos = [];

  programaSeleccionado: any = 0;
  departamentoSeleccionado: any = 0;
  
  categorias = [];

  /*dataLineChart = [
    {
      name: "",
      series: []
    }
  ]*/
  dataBarChart = [
    /*{
      name: 'Meta 01',
      value: 25
    },
    {
      name: 'Meta 02',
      value: 12
    },
    {
      name: 'Meta 03',
      value: 87
    },
    {
      name: 'Meta 04',
      value: 56
    },
    {
      name: 'Meta 05',
      value: 0
    },
    {
      name: 'Meta 06',
      value: 99
    },
    {
      name: 'Meta 07',
      value: 66
    },
    {
      name: 'Meta 08',
      value: 25
    },
    {
      name: 'Meta 09',
      value: 12
    },
    {
      name: 'Meta 10',
      value: 87
    },
    {
      name: 'Meta 11',
      value: 56
    },
    {
      name: 'Meta 12',
      value: 0
    },
    {
      name: 'Meta 13',
      value: 99
    },
    {
      name: 'Meta 14',
      value: 66
    },
    {
      name: 'Meta 15',
      value: 12
    },
    {
      name: 'Meta 16',
      value: 87
    },
    {
      name: 'Meta 17',
      value: 56
    },
    {
      name: 'Meta 18',
      value: 0
    },
    {
      name: 'Meta 19',
      value: 99
    },
    {
      name: 'Meta 20',
      value: 66
    },*/
  ];
  
  dataChart = {
    set: 'Seleccione un Departamento',
    total: [
      {
        name: 'Progreso',
        value: 0
      },
      {
        name: 'Restante',
        value: 100
      }
    ],
    data: []
  };

  dataChart1 = {};
  dataChart2 = {};

  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);

  //chartCode: any = 'cat1';

  //chartSet: any = [];
  //chartSetData: any = [];

  constructor(
    private apiService: DashboardService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsPlaDashboard",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      },
    ];

    /*this.categorias = [
      {
        id: '1',
        cod: 'cat1',
        name: 'Categoria 1'
      },
      {
        id: '2',
        cod: 'cat2',
        name: 'Categoria 2'
      }
    ];*/

    /*this.dataChartTotal = {
      cat1: [
        {
          name: 'Progreso',
          value: 11
        },
        {
          name: 'Restante',
          value: 89
        }
      ],
      cat2: [
        {
          name: 'Progreso',
          value: 20
        },
        {
          name: 'Restante',
          value: 80
        }
      ]
    };*/

    this.dataChart1 = {
      set: 'cat1',
      total: [
        {
          name: 'Progreso',
          value: 11
        },
        {
          name: 'Restante',
          value: 89
        }
      ],
      data: [
        {
          nombre: "SubCategoria 1 asdfasdfasdfasfd",
          codigo: "sc1",
          data: [
            {
              name: 'Progreso',
              value: 1
            },
            {
              name: 'Restante',
              value: 99
            }
          ]
        },
        {
          nombre: "SubCategoria 2asdfasdf",
          codigo: "sc2",
          data: [
            {
              name: 'Progreso',
              value: 2
            },
            {
              name: 'Restante',
              value: 98
            }
          ]
        },
        {
          nombre: "SubCategoria 3",
          codigo: "sc3",
          data: [
            {
              name: 'Progreso',
              value: 3
            },
            {
              name: 'Restante',
              value: 97
            }
          ]
        },
        {
          nombre: "SubCategoria 2",
          codigo: "sc4",
          data: [
            {
              name: 'Progreso',
              value: 4
            },
            {
              name: 'Restante',
              value: 96
            }
          ]
        },
        {
          nombre: "SubCategoria 5asdasdfa",
          codigo: "sc5",
          data: [
            {
              name: 'Progreso',
              value: 5
            },
            {
              name: 'Restante',
              value: 95
            }
          ]
        },
        {
          nombre: "SubCategoria 6",
          codigo: "sc6",
          data: [
            {
              name: 'Progreso',
              value: 6
            },
            {
              name: 'Restante',
              value: 94
            }
          ]
        },
        {
          nombre: "SubCategoria 7",
          codigo: "sc7",
          data: [
            {
              name: 'Progreso',
              value: 7
            },
            {
              name: 'Restante',
              value: 93
            }
          ]
        },
        {
          nombre: "SubCategoria 8",
          codigo: "sc8",
          data: [
            {
              name: 'Progreso',
              value: 8
            },
            {
              name: 'Restante',
              value: 92
            }
          ]
        },
        {
          nombre: "SubCategoria 9",
          codigo: "sc9",
          data: [
            {
              name: 'Progreso',
              value: 9
            },
            {
              name: 'Restante',
              value: 91
            }
          ]
        },
        {
          nombre: "SubCategoria 10",
          codigo: "sc10",
          data: [
            {
              name: 'Progreso',
              value: 10
            },
            {
              name: 'Restante',
              value: 90
            }
          ]
        },
        {
          nombre: "SubCategoria 11",
          codigo: "sc11",
          data: [
            {
              name: 'Progreso',
              value: 11
            },
            {
              name: 'Restante',
              value: 89
            }
          ]
        },
        {
          nombre: "SubCategoria 12",
          codigo: "sc12",
          data: [
            {
              name: 'Progreso',
              value: 12
            },
            {
              name: 'Restante',
              value: 88
            }
          ]
        },
        {
          nombre: "SubCategoria 13",
          codigo: "sc13",
          data: [
            {
              name: 'Progreso',
              value: 13
            },
            {
              name: 'Restante',
              value: 87
            }
          ]
        },
        {
          nombre: "SubCategoria 14",
          codigo: "sc14",
          data: [
            {
              name: 'Progreso',
              value: 14
            },
            {
              name: 'Restante',
              value: 86
            }
          ]
        }
      ]
    }

    this.dataChart2 = {
      set: 'cat2',
      total: [
        {
          name: 'Progreso',
          value: 20
        },
        {
          name: 'Restante',
          value: 80
        }
      ],
      data: [
        {
          nombre: "SubCategoria 15",
          codigo: "sc15",
          data: [
            {
              name: 'Progreso',
              value: 15
            },
            {
              name: 'Restante',
              value: 85
            }
          ]
        },
        {
          nombre: "SubCategoria 16",
          codigo: "sc16",
          data: [
            {
              name: 'Progreso',
              value: 16
            },
            {
              name: 'Restante',
              value: 84
            }
          ]
        },
        {
          nombre: "SubCategoria 17",
          codigo: "sc17",
          data: [
            {
              name: 'Progreso',
              value: 17
            },
            {
              name: 'Restante',
              value: 83
            }
          ]
        },
        {
          nombre: "SubCategoria 18",
          codigo: "sc18",
          data: [
            {
              name: 'Progreso',
              value: 18
            },
            {
              name: 'Restante',
              value: 82
            }
          ]
        },
        {
          nombre: "SubCategoria 19",
          codigo: "sc19",
          data: [
            {
              name: 'Progreso',
              value: 19
            },
            {
              name: 'Restante',
              value: 81
            }
          ]
        },
        {
          nombre: "SubCategoria 20",
          codigo: "sc20",
          data: [
            {
              name: 'Progreso',
              value: 20
            },
            {
              name: 'Restante',
              value: 80
            }
          ]
        },
        {
          nombre: "SubCategoria 21",
          codigo: "sc21",
          data: [
            {
              name: 'Progreso',
              value: 21
            },
            {
              name: 'Restante',
              value: 79
            }
          ]
        },
        {
          nombre: "SubCategoria 22",
          codigo: "sc22",
          data: [
            {
              name: 'Progreso',
              value: 22
            },
            {
              name: 'Restante',
              value: 78
            }
          ]
        },
        {
          nombre: "SubCategoria 23",
          codigo: "sc23",
          data: [
            {
              name: 'Progreso',
              value: 23
            },
            {
              name: 'Restante',
              value: 77
            }
          ]
        },
        {
          nombre: "SubCategoria 24",
          codigo: "sc24",
          data: [
            {
              name: 'Progreso',
              value: 24
            },
            {
              name: 'Restante',
              value: 76
            }
          ]
        }
      ]
    }


    setTimeout(() => {
      this.validatePermission();
      this.cargaProgramas();
      //this.changeChartSet(this.chartCode);
    }, 0);
    this.setPercentajes();

  }
  
  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case " IMPRIMIR":
        
        break;
    
      default:
        break;
    }
  }

  validatePermission = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fPlanifDashboard,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }
  
  /*changeChartSet(event) {
    console.log(event);
    //this.chartSetData = this.dataChart[event];
    //console.log(this.chartSet);
  }*/

  reset() {
    this.presupuesto = { periodo: new Date().getFullYear() + 1 }
    this.departamentos = [];

    this.programaSeleccionado = 0;
    this.departamentoSeleccionado = 0;
    
    this.dataChart = {
      set: 'Seleccione un Departamento',
      total: [
        {
          name: 'Progreso',
          value: 0
        },
        {
          name: 'Restante',
          value: 100
        }
      ],
      data: []
    };
    
    /*this.dataLineChart = [
      {
        name: "",
        series: []
      }
    ]*/

    this.dataBarChart = []
  }

  async cargaProgramas() {


    //this.msgSpinner = 'Cargando Periodos'
    

    this.msgSpinner = 'Cargado Programas...'


    this.periodos = await this.apiService.getPeriodos();


    this.lcargando.ctlSpinner(true)
    this.apiService.getProgramas().subscribe(
      res => {
        res['data'].forEach(p => {
          let programa = {
            id: p.id_catalogo,
            nombre: p.valor,
            codigo: p.descripcion
          }
          this.programas.push(programa);
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Programas')
        console.log(err)
      }
    )
  }

  seleccionaPrograma(event) {
    /** Funcion intermedia para limpiar la pantalla y objetos */
    this.departamentos = [];
    this.departamentoSeleccionado = 0;

    if (this.programaSeleccionado !== 0) this.cargaDepartamentos(event)
  }

  cargaDepartamentos(event) {
    /** Carga los departamentos asociados al programa seleccionado */
    this.msgSpinner = 'Cargando Departamentos...'
    this.lcargando.ctlSpinner(true)
    let data = {
      programa: event.nombre
    }

    this.apiService.getDepartamentos(data).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: 'No hay departamentos asociados.',
            icon: 'warning'
          })
          return
        }

        res['data'].forEach(d => {
          let departamento = {
            id: d.id_catalogo,
            nombre: d.valor,
            codigo: d.descripcion,
            presupuesto: {
              id: null,  // pla_departamento_presupuesto.id
              id_presupuesto: null,  // pla_departamento_presupuesto.fk_presupuesto
              monto: 0,
              asignado: 0,
              disponible: 0,
              estado: 0
            }
          }
          this.departamentos.push(departamento)
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
        console.log(err)
      }
    )
  }

  cargaDashboardDepartamento(event) {
    this.msgSpinner = 'Cargando datos del Departamento...';
    this.lcargando.ctlSpinner(true);

    /** Al seleccionar un departamento, cargo los datos de los avances de cada tarea */
    let data = {
      departamento: event,
    }
    
    this.apiService.getDashboard(data).subscribe(
      (res) => {
        console.log(res['data']);
        if (res['data'].length > 0) {
          this.dataChart = {
            set: 'Seleccione un Departamento',
            total: [
              {
                name: 'Progreso',
                value: 0
              },
              {
                name: 'Restante',
                value: 100
              }
            ],
            data: []
          };
          /*this.dataLineChart = [
            {
              name: "",
              series: []
            }
          ]*/
          this.dataBarChart = [];
          this.dataChart.set = this.departamentoSeleccionado.nombre;
          //this.dataLineChart[0].name = this.departamentoSeleccionado.nombre;
          let promedio = 0;
          let nMeta = 0;
          res['data'].forEach(d => {
            promedio += +d.avg_realizacion;
            nMeta += 1;
            let meta = {
              nombre: d.fk_atribucion.valor,
              codigo: d.fk_atribucion.descripcion,
              data: [
                {
                  name: 'Progreso',
                  value: +d.avg_realizacion
                },
                {
                  name: 'Restante',
                  value: 100 - (+d.avg_realizacion)
                }
              ]
            }
            let line = {
              name: d.fk_atribucion.descripcion ? d.fk_atribucion.descripcion + " - " + d.fk_atribucion.valor : "Meta " + nMeta + " - " + d.fk_atribucion.valor,
              value: +d.avg_realizacion
            }
            this.dataChart.data.push(meta);
            //this.dataLineChart[0].series.push(line);
            this.dataBarChart.push(line);
          });
          promedio = promedio / res['data'].length;
          this.dataChart.total = [
            {
              name: 'Progreso',
              value: promedio
            },
            {
              name: 'Restante',
              value: 100 - promedio
            }
          ]
          this.setPercentajes();
        } else {
          this.toastr.warning('No existen metas para este departamento', 'Error cargando Datos');
        }
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Presupuesto de Programa');
      }
    );
  }

  yAxisTickFormatting(value) {
    return value + "%" // this is where you can change the formatting
  }

  setPercentajes() {
    setTimeout(() => {
      let numeritos = document.getElementsByClassName('textDataLabel');
      console.log(numeritos);
      for (var i = 0; i < numeritos.length; i++) {
        numeritos[i].innerHTML = numeritos[i].innerHTML.trim() + "%";
      }
    }, 200);
  }

}
