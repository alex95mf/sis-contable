import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
// import { CategoriaProductoService } from '../categoria-producto.service';
// import { ConceptosService } from '../conceptos.service';
import { ReformaInternaService } from '../reforma-interna.service';

@Component({
standalone: false,
  selector: 'app-modal-cuent-pre',
  templateUrl: './modal-cuent-pre.component.html',
  styleUrls: ['./modal-cuent-pre.component.scss']
})
export class ModalCuentPreComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle:any;

  encargados: any = []

  vmButtons: any

  dataUser: any

  filter: any
  paginate: any
  

  @Input() validacionModal: any
  @Input() validar: any
  @Input() partida: any
  @Input() programa: any
  @Input() departamento: any
  @Input() periodo: any

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: ReformaInternaService
  ) { 

  }

  ngOnInit(): void {
    if(this.validacionModal){
      
      this.fTitle = 'Modal cuentas'
    }else{
      
      this.fTitle = 'Modal Presupuesto'
    }
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
      codigo: undefined,
      nombre: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      if(this.validacionModal){
        this.cargarEncargado()
        this.fTitle = 'Modal cuentas'
      }else{
        this.cargarPresupuesto()
        this.fTitle = 'Modal Presupuesto'
      }
      
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
      }
    }

    this.servicio.getConCuentas(data).subscribe(
      (res)=>{
        console.log(res);
        this.paginate.length= res['data']['total']
        if(res['data']['current_page'] == 1){
          this.encargados = res['data']['data']
        }else{
          this.encargados = Object.values(res['data']['data'])
        }
        this.lcargando.ctlSpinner(false);
      }
    )


  }

  aplicarFiltros(){
    Object.assign( this.paginate,{ page: 1 ,pageIndex:0})
    if(this.validacionModal){
      
      this.cargarEncargado()
    }else{
      
      this.cargarPresupuesto()
    }
  }

  limpiarFiltros(){
    this.filter = {
      codigo: undefined,
      nombre: undefined,
      filterControl: ""
    }
  }



  cargarPresupuesto(){
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        programa: this.programa,
        departamento: this.departamento,
        periodo: this.periodo,
      }
    }

    console.log(data)

    this.servicio.getCatalogoPresupuesto(data).subscribe(
      (res)=>{
        // console.log(res);
        this.paginate.length= res['data']['total']
        if(res['data']['current_page'] == 1){
          this.encargados = res['data']['data']
        }else{
          this.encargados = Object.values(res['data']['data'])
        }
        this.lcargando.ctlSpinner(false);
      }
    )

  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarEncargado();
  }

  changePaginatePresupuesto(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarPresupuesto();
  }

  selectOption(dt){

    this.commonVrs.modalreformaPrespuestoCod.next({data:dt, validacion: this.validar,partida: this.partida})
    this.activeModal.close()

  }

}
