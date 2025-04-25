import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import {TreeNode} from 'primeng/api';
import Swal from "sweetalert2/dist/sweetalert2.js";
@Component({
  selector: "app-organizacion",
  templateUrl: "./organizacion.component.html",
  styleUrls: ["./organizacion.component.scss"],
})
export class OrganizacionComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  dataUser: any;
  vmButtons = [];
  permissions: any;
  data: TreeNode[];
  dataPie: any[];
  colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 

  colorSchemeCharts = [
    {domain: ['#000099', '#E5E5F4']},
    {domain: ['#D22E2E', '#E6A5A6']},
    {domain: ['#378D3B', '#A8CBAC']}
  ];
  colorSchemeChartsMulti = {
    domain: ['#000099']
  };

  categorias = [];
  dataChartTotal = {};
  dataChart = {};

  chartCode: any = 'cat1';

  chartSet: any = [];
  chartSetData: any = [];

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnOrganizacion",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      }
    ];

    this.data = [{
      label: 'Gerencia',
      type: 'person',
      styleClass: 'p-person',
      expanded: true,
      data: {name:'Gerente'},
      children: [
        {
          label: 'Ventas',
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name:'Nathaly'},
          children:[{
            label: 'Tax',
            styleClass: 'department-cfo'
          },
          {
            label: 'Legal',
            styleClass: 'department-cfo'
          }],
        },
        {
          label: 'Procesos',
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name:'Airton Marino'},
          children:[{
            label: 'Operations',
            styleClass: 'department-coo'
          }]
        },
        {
          label: 'Sistemas',
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name:'Ney Galecio'},
          children:[{
            label: 'Desarrolladores',
            styleClass: 'department-cto',
            expanded: true,
            children:[{
              label: 'Josué Cabezas',
              styleClass: 'department-cto'
            },
            {
              label: 'David Barrera',
              styleClass: 'department-cto'
            }]
          },
          {
            label: 'QA',
            styleClass: 'department-cto'
          },
          {
            label: 'R&D',
            styleClass: 'department-cto'
          }]
        }
      ]
    }];

    this.dataPie = [
      {
        name: 'Germany',
        value: 40632
      },
      {
        name: 'United States',
        value: 49737
      },
      {
        name: 'France',
        value: 36745
      },
      {
        name: 'United Kingdom',
        value: 36240
      },
      {
        name: 'Spain',
        value: 33000
      },
      {
        name: 'Italy',
        value: 35800
      }
    ];

    this.categorias = [
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
    ];

    this.dataChartTotal = {
      cat1: [
        {
          name: 'Categoria 1',
          value: 11
        },
        {
          name: 'Restante',
          value: 89
        }
      ],
      cat2: [
        {
          name: 'Categoria 2',
          value: 20
        },
        {
          name: 'Restante',
          value: 80
        }
      ]
    };

    this.dataChart = {
      cat1: [
        {
          nombre: "SubCategoria 1",
          codigo: "sc1",
          data: [
            {
              name: 'Completado',
              value: 1
            },
            {
              name: 'Restante',
              value: 99
            }
          ]
        },
        {
          nombre: "SubCategoria 2",
          codigo: "sc2",
          data: [
            {
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
              value: 4
            },
            {
              name: 'Restante',
              value: 96
            }
          ]
        },
        {
          nombre: "SubCategoria 5",
          codigo: "sc5",
          data: [
            {
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
              value: 14
            },
            {
              name: 'Restante',
              value: 86
            }
          ]
        }
      ],
      cat2: [
        {
          nombre: "SubCategoria 15",
          codigo: "sc15",
          data: [
            {
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
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
              name: 'Completado',
              value: 22
            },
            {
              name: 'Restante',
              value: 78
            }
          ]
        },
      ]
    }

    console.log(this.colorSchemeCharts.length)

    setTimeout(() => {
      this.validatePermission();
      this.changeChartSet(this.chartCode);
    }, 50);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " IMPRIMIR":
        
        break;
    }
  }

  public onSelect(event) {
    console.log(event);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fDistribuidor,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  changeChartSet(event) {
    console.log(event);
    this.chartSet = this.dataChartTotal[event];
    this.chartSetData = this.dataChart[event];
  }

}