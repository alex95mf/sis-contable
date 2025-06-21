import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import { ReclasificacionService } from './reclasificacion.service';
import { IFilter, IProducto, IProductoResponse } from './IProducto';
import { ModalReasignacionComponent } from './modal-reasignacion/modal-reasignacion.component';

@Component({
standalone: false,
  selector: 'app-reclasificacion',
  templateUrl: './reclasificacion.component.html',
  styleUrls: ['./reclasificacion.component.scss']
})
export class ReclasificacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Reclasificacion de Inventario';
  vmButtons: Array<any> = []
  mensajeSpinner: string = "Cargando...";
  permissions: any;
  dataUser: any;

  filter: IFilter = {
    codigo: null,
    descripcion: null,
  }
  paginate = {
    pageIndex: 0,
    page: 1,
    perPage: 20,
    length: 0,
    pageSizeOptions: [10, 20, 30, 40]
  }

  productos: Array<IProducto> = [];

  constructor(
    private apiService: ReclasificacionService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      /* {
        orig: "btnsBienesMovimientoReclasificacion",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }, */
      {
        orig: "btnsBienesMovimientoReclasificacion",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBienesMovimientoReclasificacion",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ];

    setTimeout(() => {
      // this.validaPermisos()
      this.getProductos()
    }, 50)

    this.apiService.refresh$.subscribe(() => this.consultar())
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      /* case "GUARDAR":
        
        break; */
      case "BUSCAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    this.commonService.getPermisionsGlobas({
      codigo: myVarGlobals.fGestBienesReclasificacion,
      id_rol: this.dataUser.id_rol
    }).subscribe(
      (res: any) => {
        this.permissions = res.data[0]
        if (this.permissions.abrir == '0') {
          this.lcargando.ctlSpinner(false)
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle)
        } else {
          this.lcargando.ctlSpinner(false)
          this.getProductos()
        }
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })

    this.lcargando.ctlSpinner(true);
    this.getProductos()
  }

  changePaginate(event) {
    Object.assign(this.paginate, { page: event.pageIndex + 1 })

    this.lcargando.ctlSpinner(true);
    this.getProductos()
  }

  async getProductos() {
    this.lcargando.ctlSpinner(true);
    try {
      let response = await this.apiService.getProductos({params: {filter: this.filter, paginate: this.paginate}});
      this.paginate.length = response.total
      this.productos = response.data
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Productos')
    }
  }

  expandReasignacion(producto: IProducto) {
    const modal = this.modalService.open(ModalReasignacionComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.producto = producto

    // modal.result.then(() => this.getProductos())
  }

  clearFilter() {
    Object.assign(this.filter, {
      codigo: null,
      descripcion: null,
    })
  }

}
