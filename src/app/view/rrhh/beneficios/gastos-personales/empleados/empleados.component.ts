import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EmpleadosService } from './empleados.service'; 
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @Input() periodo_id: any;
  encargados: any = []

  vmButtons: any

  dataUser: any

  filter: any
  paginate: any


  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: EmpleadosService,
    private generalService: GeneralService,
  ) { 

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnEncargadoForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarEncargado()
    },500)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal(){
    this.activeModal.close()
  }

  cargarEncargado(){
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      },
      periodo_id: this.periodo_id
    }
    //let parameter_periodo_id = this.periodo_id;

    this.generalService.getPersonalEmpleados(data).subscribe(
      (res) => {
        console.log(res);
        this.encargados = res
      },
      (error) => {
      
      
      }
    );

    // this.servicio.setEmpleado(data).subscribe(
    //   (res)=>{
    //     // console.log(res);
    //     this.paginate.length= res['data']['total']
    //     if(res['data']['current_page'] == 1){
    //       this.encargados = res['data']['data']
    //     }else{
    //       this.encargados = Object.values(res['data']['data'])
    //     }
    //     this.lcargando.ctlSpinner(false);
    //   }
    // )


  }


  limpiarFiltros(){
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarEncargado();
  }

  selectOption(dt){

    this.commonVrs.encargadoSelect.next(dt)
    this.activeModal.close()

  }

}
