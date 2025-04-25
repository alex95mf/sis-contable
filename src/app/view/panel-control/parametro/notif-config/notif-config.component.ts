import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotifConfigService } from './notif-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import Swal from 'sweetalert2';
import { ModalAlertasComponent } from './modal-alertas/modal-alertas.component';

@Component({
  selector: 'app-notif-config',
  templateUrl: './notif-config.component.html',
  styleUrls: ['./notif-config.component.scss']
})
export class NotifConfigComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = []
  tbl_notificaciones: any[] = []

  lst_modulo: any[] = []
  lst_tipo_notificacion: any[] = []
  lst_tipo_filter: any[] = []

  filter: any = {
    modulo: null,
    tipo_alerta: null,
    nombre: null,
  }

  paginate: any = {
    page: 1,
    pageIndex: 0,
    perPage: 20,
    length: 0,
    pageSizeOptions: [5, 10, 20]
  }

  constructor(
    private apiService: NotifConfigService,
    private modalService: NgbModal,
    private toastr: ToastrService,

  ) {
    this.vmButtons = [
      {orig: 'btnsNotifConfigComponent', paramAccion: '', boton: {icon: 'fas fa-plus-square', texto: 'NUEVO'}, clase: 'btn btn-sm btn-success', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsNotifConfigComponent', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsNotifConfigComponent', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
    ]

    this.apiService.setAlerta$.subscribe(
      () => this.consultar()
    )
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'NUEVO':
        this.createAlerta()
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
    this.lcargando.ctlSpinner(true)
    await this.getModulos()
    await this.getCatalogos()
    await this.getAlertas()
    this.lcargando.ctlSpinner(false)
  }

  async getModulos() {
    try {
      this.msgSpinner = 'Cargando Modulos'
      const response = await this.apiService.getModulos();
      console.log(response)
      //
      this.lst_modulo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  async getCatalogos() {
    try {
      this.msgSpinner = 'Cargando Catalogos'
      const response = await this.apiService.getCatalogo({params: "'TIPO_NOTIFICACION_ALERTA'"})
      console.log(response)
      //
      this.lst_tipo_notificacion = response.data['TIPO_NOTIFICACION_ALERTA']
      this.lst_tipo_filter = this.lst_tipo_notificacion;

    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  async consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.lcargando.ctlSpinner(true)
    await this.getAlertas()
    this.lcargando.ctlSpinner(false)
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.lcargando.ctlSpinner(true)
    await this.getAlertas()
    this.lcargando.ctlSpinner(false)
  }

  async getAlertas() {
    try {
      this.msgSpinner = 'Cargando Alertas'
      const response = await this.apiService.getAlertas({filter: this.filter, paginate: this.paginate})
      console.log(response)

      this.tbl_notificaciones = response.data.data
      this.paginate.length = response.data.total
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Notificaciones')
    }
  }

  createAlerta() {
    // Modal para Crear Alerta
    const modal = this.modalService.open(ModalAlertasComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.lst_modulo = this.lst_modulo
    modal.componentInstance.lst_tipo_notificacion = this.lst_tipo_notificacion
  }

  editAlerta(notificacion: any) {
    // Modal para Editar Notificacion
    const modal = this.modalService.open(ModalAlertasComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.lst_modulo = this.lst_modulo
    modal.componentInstance.lst_tipo_notificacion = this.lst_tipo_notificacion
    modal.componentInstance.alerta = notificacion
  }

  async deleteAlerta(notificacion: any) {
    const result = await Swal.fire({
      titleText: 'Eliminar Notificacion',
      text: 'Esta seguro/a desea eliminar este registro?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      await this.eliminarAlerta(notificacion)
      this.lcargando.ctlSpinner(false)
    }
  }

  async eliminarAlerta(notificacion: any) {
    try {
      this.msgSpinner = 'Eliminando Registro'
      const response = await this.apiService.deleteAlerta(notificacion.id, {notificacion})
      console.log(response)
      const idx = this.tbl_notificaciones.findIndex((element: any) => element.id == notificacion.id)
      this.tbl_notificaciones.splice(idx, 1)
      Swal.fire('Registro eliminado', '', 'success')
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Notificaciones')
    }
  }

  filterTipoNotificacion({nombre}) {
    // console.log(event)
 //   this.lst_tipo_filter = this.lst_tipo_notificacion.filter((element: any) => element.grupo == nombre)

    this.lst_tipo_filter = this.lst_tipo_notificacion;
  }

  clearFilter() {
    this.filter = {
      modulo: null,
      tipo_notificacion: null,
      empleado_full_nombre: null,
    }

    this.lst_tipo_filter =this.lst_tipo_notificacion;
    
  }

}
