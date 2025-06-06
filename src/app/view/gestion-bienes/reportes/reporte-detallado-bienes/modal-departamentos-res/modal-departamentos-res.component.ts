import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalDepartamentosResService } from './modal-departamentos-res.service'; 

@Component({
standalone: false,
  selector: 'app-modal-departamentos-res',
  templateUrl: './modal-departamentos-res.component.html',
  styleUrls: ['./modal-departamentos-res.component.scss']
})
export class ModalDepartamentosResComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string

  departamentos: any = []

  vmButtons: any

  dataUser: any

  filter: any
  paginate: any


  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: ModalDepartamentosResService
  ) { 

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnDepForm",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnDepForm",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnDepForm",
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
      this.cargarDepartamentos()
    },500)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
        case " CONSULTAR":
          this.cargarDepartamentos();
          break;
          case " LIMPIAR":
            this.limpiarFiltros();
            break;
    }
  }

  closeModal(){
    this.activeModal.close()
  }
 

  cargarDepartamentos(flag: boolean = false){
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1;
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.servicio.cargarDepartamentos(data).subscribe(
      (res)=>{
        // console.log(res);
        this.paginate.length= res['data']['total']
        if(res['data']['current_page'] == 1){
          this.departamentos = res['data']['data']
        }else{
          this.departamentos = Object.values(res['data']['data'])
        }
        this.lcargando.ctlSpinner(false);
      }
    )


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
    this.cargarDepartamentos();
  }

  selectOption(dt){

    this.commonVrs.departamentoSelectRes.next(dt)
    this.activeModal.close()

  }

}
