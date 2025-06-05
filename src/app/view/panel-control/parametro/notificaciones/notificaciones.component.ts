import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { NotificacionesService } from './notificaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';

@Component({
standalone: false,
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = []
  tbl_notificaciones: any[] = []

  lst_modulo: any[] = []
  lst_tipo_notificacion: any[] = []
  lst_tipo_filter: any[] = []

  filter: any = {
    modulo: null,
    tipo_notificacion: null,
    empleado_full_nombre: null,
  }

  paginate: any = {
    page: 1,
    pageIndex: 0,
    perPage: 20,
    length: 0,
    pageSizeOptions: [5, 10, 20]
  }

  constructor(
    private apiService: NotificacionesService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {orig: 'btnsNotificacionesComponent', paramAccion: '', boton: {icon: 'fas fa-plus-square', texto: 'NUEVO'}, clase: 'btn btn-sm btn-success', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsNotificacionesComponent', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsNotificacionesComponent', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
    ]

    this.apiService.setNotificacion$.subscribe(
      async () => {
        this.lcargando.ctlSpinner(true);
        await this.getNotificaciones()
        this.lcargando.ctlSpinner(false)
      }
    )
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'NUEVO':
        this.createNotificacion()
        break;
      case 'CONSULTAR':
        this.consultar()
        break;
      case 'LIMPIAR':
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    await this.getCatalogos()
    await this.getModulos()
    await this.getNotificaciones()
    this.lcargando.ctlSpinner(false)
  }

  async getCatalogos() {

    try {
      (this as any).mensajeSpinner = 'Cargando Catalogos'
      const response = await this.apiService.getCatalogo({params: "'TIPO_NOTIFICACION_MODULO', 'TIPO_NOTIFICACION_CORREO'"})
      console.log(response)
      // this.lst_modulo = response.data['TIPO_NOTIFICACION_MODULO']
      this.lst_tipo_notificacion = response.data['TIPO_NOTIFICACION_CORREO']
      this.lst_tipo_filter = this.lst_tipo_notificacion;
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  async getModulos() {
    try {
      (this as any).mensajeSpinner = 'Cargando Modulos'
      const response = await this.apiService.getModulos();
      console.log(response)
      this.lst_modulo = response.data
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  async consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.lcargando.ctlSpinner(true);
    await this.getNotificaciones()
    this.lcargando.ctlSpinner(false)
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.lcargando.ctlSpinner(true);
    await this.getNotificaciones()
    this.lcargando.ctlSpinner(false)
  }

  async getNotificaciones() {
    try {
      (this as any).mensajeSpinner = 'Cargando Notificaciones'
      const response = await this.apiService.getNotificaciones({filter: this.filter, paginate: this.paginate})
      console.log(response)

      this.tbl_notificaciones = response.data.data
      this.paginate.length = response.data.total
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Notificaciones')
    }
  }

  filterTipoNotificacion({nombre}) {
    // console.log(event)
    this.lst_tipo_filter = this.lst_tipo_notificacion.filter((element: any) => element.grupo == nombre);

    this.lst_tipo_filter = this.lst_tipo_notificacion;
  }

  clearFilter() {
    this.filter = {
      modulo: null,
      tipo_notificacion: null,
      empleado_full_nombre: null,
    }
  }

  createNotificacion() {
    // Modal para Crear Notificacion
    const modal = this.modalService.open(ModalDetallesComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.lst_modulo = this.lst_modulo
    modal.componentInstance.lst_tipo_notificacion = this.lst_tipo_notificacion
  }

  editNotificacion(notificacion: any) {
    // Modal para Editar Notificacion
    const modal = this.modalService.open(ModalDetallesComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.lst_modulo = this.lst_modulo
    modal.componentInstance.lst_tipo_notificacion = this.lst_tipo_notificacion
    modal.componentInstance.notificacion = notificacion
  }

  async deleteNotificacion(notificacion: any) {
    const result = await Swal.fire({
      titleText: 'Eliminar Notificacion',
      text: 'Esta seguro/a desea eliminar este registro?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      await this.eliminarNotificacion(notificacion)
      this.lcargando.ctlSpinner(false)
    }
  }

  async eliminarNotificacion(notificacion: any) {
    try {
      (this as any).mensajeSpinner = 'Eliminando Registro'
      const response = await this.apiService.deleteNotificacion(notificacion.id, {notificacion})
      console.log(response)
      const idx = this.tbl_notificaciones.findIndex((element: any) => element.id == notificacion.id)
      this.tbl_notificaciones.splice(idx, 1)
      Swal.fire('Registro eliminado', '', 'success')
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Notificaciones')
    }
  }

}
