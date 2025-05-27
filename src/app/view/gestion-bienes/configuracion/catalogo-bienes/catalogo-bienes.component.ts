import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'date-fns';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CatalogoBienesService } from './catalogo-bienes.service';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalCreateComponent } from './modal-create/modal-create.component';

@Component({
  selector: 'app-catalogo-bienes',
  templateUrl: './catalogo-bienes.component.html',
  styleUrls: ['./catalogo-bienes.component.scss']
})
export class CatalogoBienesComponent implements OnInit {

  catalogoBienes: any = []
  vmButtons:any=[];
  filter: any;
  paginate: any

  firstday: any;
  today: any;
  tomorrow: any;

  estado = [
    {valor: 'I', descripcion: "Inactivo"},
    {valor: 'A', descripcion: "Activo"},
  ]


  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";

  constructor(
    private service: CatalogoBienesService,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService
  ) {
    this.commonVrs.CatalogoBienes.asObservable().subscribe(
      (res)=>{
        this.ObtenerCatalogoBienes();
      }
    )
  }

  ngOnInit(): void {


 
    this.vmButtons = [

      {
        orig: "btnCatalogoBienes",
        paramAction: "",
        boton: { icon: "fas fa-plus-square-o", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnCatalogoBienes",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnCatalogoBienes",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
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
      estado: null,
      filterControl: ""  
    };

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };

    setTimeout(()=>{
      this.ObtenerCatalogoBienes()
    },500)
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.agregarModalCatalogo();
        break;

        case "CONSULTAR":
          this.ObtenerCatalogoBienes();
          break;

          case "CANCELAR":
            this.limpiarFiltro();
            break;
    }
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
  }

  limpiarFiltro(){
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
  }

  eliminarCata(item){
    let data = {
      id: item['id_catalogo_bienes']
    }
    console.log(data);
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar el catalogo de bienes?.",
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
    let modal = this.modalDet.open(ModalCreateComponent,{
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

}
