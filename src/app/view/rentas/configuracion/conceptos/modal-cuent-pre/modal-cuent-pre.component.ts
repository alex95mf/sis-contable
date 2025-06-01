import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
// import { CategoriaProductoService } from '../categoria-producto.service';
import { ConceptosService } from '../conceptos.service';

@Component({
standalone: false,
  selector: 'app-modal-cuent-pre',
  templateUrl: './modal-cuent-pre.component.html',
  styleUrls: ['./modal-cuent-pre.component.scss']
})
export class ModalCuentPreComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string;

  encargados: any = []

  vmButtons: any

  dataUser: any

  filter: any
  paginate: any
  

  @Input() filtrar: any
   @Input() tieneReglas: any
  @Input() validacionModal: any
  @Input() validar: any
  @Input() restricciones: Array<string> = [];


  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: ConceptosService
  ) {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      codigo: null,
      nombre: null
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }
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

    this.fTitle = (this.validacionModal) ? 'Cuentas Contables' : 'Codigo Presupuestario'

    setTimeout(()=>{
      if(this.validacionModal && !this.tieneReglas){
        this.cargarCuentas()
      }else if (!this.validacionModal && !this.tieneReglas){
        this.cargarPresupuesto()
      } else{
        this.cargarCuentasReglas()
      }
      
    }, 50)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
    }
  }

  aplicarFiltros(){
    Object.assign(
      this.paginate,
      { page: 1, pageIndex: 0 }
    )
    if(this.validacionModal && !this.tieneReglas){
      // Cuenta Acreedora o Deudora
      this.cargarCuentas()
    }else if (!this.validacionModal && !this.tieneReglas){
      // Codigo Presupuestario
      this.cargarPresupuesto()
    }else{
      this.cargarCuentasReglas()
    }
  }

  limpiarFiltros(){
    this.filter = {
      codigo: null,
      nombre: null,
    }
  }

  cargarCuentas(){
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      },
      restricciones: this.restricciones,
    }

    this.servicio.getConCuentas(data).subscribe(
      (res: any)=>{
        console.log(res);
        this.paginate.length = res.data.total
        this.encargados = res.data.data
        
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    )


  }

  cargarPresupuesto(){
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.servicio.getCatalogoPresupuesto(data).subscribe(
      (res: any)=>{
        // console.log(res);
        this.paginate.length = res.data.total
        this.encargados = res.data.data
        
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    )

  }

  cargarCuentasReglas(){
    console.log("cuentasconreglas");
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        q: this.filtrar
      }
    }

    this.servicio.getConCuentasconReglas(data).subscribe(
      (res: any)=>{
        console.log(res);
        this.paginate.length = res.data.total
        this.encargados = res.data.data
        
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    )


  }
  

  changePaginate({pageIndex}) {
    let newPaginate = {
      // perPage: event.pageSize,
      page: pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    
    if (!this.tieneReglas){
      this.cargarCuentas();
    }else{
      this.cargarCuentasReglas()
    }
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

    this.commonVrs.seleciconCategoriaCuentaPro.next({data:dt, validacion: this.validar})
    this.activeModal.close()

  }

}
