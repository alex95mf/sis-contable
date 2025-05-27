import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'date-fns';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CategoriaProductoService } from './categoria-producto.service';
import { ModalCreacionComponent } from './modal-creacion/modal-creacion.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.scss']
})
export class CategoriaProductoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";

  grupo = {
    codigo_grupo_producto: null,
    descripcion: null,
    codigo_cuenta_contable: null,
    codigo_presupuesto: null,
    estado: null,
    descripcion_cuenta: null,
    descripcion_presupuesto: null,
    tipo_bien: null
  }

  estado = [
    {valor: 'I', descripcion: "Inactivo"},
    {valor: 'A', descripcion: "Activo"},
  ]

 

  catalogoBienes: any = []

  catalog: any = []

  filter: any;
  paginate: any

  firstday: any;
  today: any;
  tomorrow: any;

  vmButtons: any

  validacion: boolean = true

  constructor(
    private service: CategoriaProductoService,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.CatalogoBienes.asObservable().subscribe(
      (res)=>{
        this.ObtenerCatalogoBienes();
      }
    )

    this.commonVrs.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if(res['validacion']){
          this.grupo.codigo_cuenta_contable = res['data']['codigo'];        
          this.grupo.descripcion_cuenta = res['data']['nombre'];
        }else{
          this.grupo.codigo_presupuesto = res['data']['codigo'];
          this.grupo.descripcion_presupuesto = res['data']['nombre']
        }
        

        
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "far fa-plus-square", texto: "Nuevo" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "Editar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      codigo: null,
      descripcion: null,
      filterControl: ""  
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    setTimeout(()=>{
      this.ObtenerCatalogoBienes()
    },500)
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      
      case "Nuevo":
        this.newGrupo();
        break;

      case "Guardar":
        this.agregarCatalogo();
        break;

      case "Editar":
        this.guardarEdition();
        break;
      
      case "Limpiar":
        this.limpiarForm()
        // this.activeModal.close()
        break;
    }
  }


  limpiarForm(){

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario de grupo de producto?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.vmButtons[0].habilitar = false
        this.vmButtons[1].habilitar = true
        this.vmButtons[2].habilitar = true
        this.validacion = true
        this.grupo = {
          codigo_grupo_producto: null,
          descripcion: null,
          codigo_cuenta_contable: null,
          codigo_presupuesto: null,
          estado: null,
          descripcion_cuenta: null,
          descripcion_presupuesto: null,
          tipo_bien: null
        }
      }
    });

    

  }

  newGrupo(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea agregar un nuevo grupo de producto?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.validacion = false
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[2].habilitar = true
      }
    });
    
  }


  agregarCatalogo(){
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    
    console.log(this.grupo);
    this.service.saveCatalogoBienes(this.grupo).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se creo un nuevo grupo de producto",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8'
        }).then((result) => {
          if (result.isConfirmed) {
            // this.activeModal.close()
            // this.commonVrs.CatalogoBienes.next()
            this.ObtenerCatalogoBienes()
            this.vmButtons[1].habilitar = true
          }
        })
      }
    )
  }

  guardarEdition(){
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    console.log(this.grupo);
    this.service.updateCatalogoBienes(this.grupo).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se actualizó con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8'
        }).then((result) => {
          if (result.isConfirmed) {
            // this.activeModal.close()
            // this.commonVrs.CatalogoBienes.next()
            this.ObtenerCatalogoBienes()
          }
        })
        
        
      }
    )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.ObtenerCatalogoBienes();
  }

  ObtenerCatalogoBienes(){
    this.mensajeSppiner = "Cargando Catalogos bienes...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.service.getCatalogoBienes(data).subscribe(
      (res)=>{
        console.log(res);
        // this.catalogoBienes = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.catalogoBienes = res['data']['data'];
        } else {
          this.catalogoBienes = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error)=>{
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )

    let data_cat = {
      params: " 'NV_TIPO_BIEN' ",
    };
    this.service.getCatalogs(data_cat).subscribe(
      (res) => {
        console.log(res);
        this.catalog = res["data"]["NV_TIPO_BIEN"];

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  EditarGrupo(item){
    console.log(item);
    this.grupo = item
    this.grupo.descripcion_cuenta = item.cuentas?.nombre
    this.grupo.descripcion_presupuesto = item.presupuesto?.nombre
    this.validacion = false
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false
  }

  limpiarFiltro(){
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      codigo: null,
      descripcion: null,
      estado: null,
      filterControl: ""  
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

  eliminarCata(item){
    let data = {
      id_grupo_productos: item['id_grupo_productos']
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar el grupo de producto?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.service.deleteCatalogoBienes(data).subscribe(
          (res)=>{
            console.log(res);
            Swal.fire({
              icon: "success",
              title: "Se eliminó con éxito",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result) => {
              if (result.isConfirmed) {
                this.ObtenerCatalogoBienes()
              }
            })
          }
        )
      }
    })
    
  }

  agregarModalCatalogo(){
    let modal = this.modalDet.open(ModalEditionComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  modalEdition(item){
    let modal = this.modalDet.open(ModalEditionComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.item = item;
  }

  modalCodigoPresupuesto(){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = false
  }

  modalCuentaContable(){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    
  }

  

}

