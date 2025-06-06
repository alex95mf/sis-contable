import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TramitesService } from '../../tramites.service';

@Component({
standalone: false,
  selector: 'app-modal-tareas',
  templateUrl: './modal-tareas.component.html',
  styleUrls: ['./modal-tareas.component.scss']
})
export class ModalTareasComponent implements OnInit {

  filter: any;
  paginate: any;


  vmButtons: any;

  tareasTable: any = [];
  prioridadSelected = 0
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
    
  ]

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private serviceAdmin: TramitesService,
    private activeModal: NgbActiveModal,
    private commonService: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      // {
      //   orig: "btnsTareas",
      //   paramAccion: "",
      //   boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false
      // },
      {
        orig: "btnsTareas",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTareas",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTareas",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      },
    ];

    this.filter = {
      tarea: undefined,
      prioridad: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {this.cargartarea()}, 50)
    
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "REGRESAR":
        this.activeModal.close()
        break;
        case "CONSULTAR":
          this.cargartarea();
          break;
          case "LIMPIAR":
            this.limpiarFiltros();
            break;
    }
  }

  selectOption(tarea){
    this.commonService.selectTramites.next({tarea: tarea})
    this.activeModal.close()
    console.log(tarea);
  }
  asignarPrioridad(evt) {
    this.filter.prioridad = [evt]
   }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargartarea();
  }

  limpiarFiltros() {
    this.filter = {
      tarea: undefined,
      prioridad: undefined,
      filterControl: ""
    }
    this.prioridadSelected = 0
  }

  cargartarea(){
    (this as any).mensajeSpinner = "Cargando lista de Tareas...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    this.serviceAdmin.getTarea(data).subscribe(
      (res) =>{
        this.tareasTable = res['data'];
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.tareasTable = [];
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.tareasTable = res['data']['data'];
          } else {
            this.tareasTable = Object.values(res['data']['data']);
          }
        }
        this.lcargando.ctlSpinner(false);
      },
      (erro)=>{
        console.log(erro);
      }
    )
  }

}
