import { Component, OnInit, ViewChild } from '@angular/core';
import { OtrasConfiguracionesService } from './otras-configuraciones.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfiguracionDetallesComponent } from './modal-configuracion-detalles/modal-configuracion-detalles.component';

@Component({
  selector: 'app-otras-configuraciones',
  templateUrl: './otras-configuraciones.component.html',
  styleUrls: ['./otras-configuraciones.component.scss']
})
export class OtrasConfiguracionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = []

  filter: any = {
    periodo: null,
    modulo: null,
    codigo: null,
    tipo: null,
    estado: null,
  }

  paginate: any = {
    page: 1,
    pageIndex: 0,
    perPage: 20,
    length: 0,
  }

  cmb_periodo: any[] = []
  cmb_modulo: any[] = []
  // cmb_tipo: any[] = []
  // cmb_tipo_filtered: any[] = []
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]

  tbl_configuraciones: any[] = []

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private apiService: OtrasConfiguracionesService,
  ) {
    this.vmButtons = [
      {orig: 'btnsOtrasConfiguracionesComponent', paramAccion: '', boton: {icon: 'fas fa-plus-square', texto: 'NUEVO'}, clase: 'btn btn-sm btn-success', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsOtrasConfiguracionesComponent', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsOtrasConfiguracionesComponent', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
    ]

    this.apiService.updateConfiguracion$.subscribe(() => this.consultar())
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'NUEVO':
        this.createConfiguracion()
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
    await this.getPeriodos()
    await this.getCatalogos()
    await this.getConfiguraciones()
    this.lcargando.ctlSpinner(false)
  }

  async consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.lcargando.ctlSpinner(true)
    await this.getConfiguraciones()
    this.lcargando.ctlSpinner(false)
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.lcargando.ctlSpinner(true)
    await this.getConfiguraciones()
    this.lcargando.ctlSpinner(false)
  }

  async getPeriodos() {
    try {
      this.msgSpinner = 'Cargando Periodos'
      const response = await this.apiService.getPeriodos()
      console.log(response)
      this.cmb_periodo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Periodos')
    }
  }

  async getCatalogos() {
    try {
      this.msgSpinner = 'Cargando Catalogos'
      const response = await this.apiService.getCatalogos({params: "'CONFIGURACION_MODULO'"})
      console.log(response)
      this.cmb_modulo = response.data['CONFIGURACION_MODULO']
      // this.cmb_tipo = response.data['CONFIGURACION_TIPO']
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Configuraciones')
    }
  }

  async getConfiguraciones() {
    try {
      this.msgSpinner = 'Cargando Configuraciones'
      const response = await this.apiService.getConfiguraciones({params: {filter: this.filter, paginate: this.paginate}})
      console.log(response)
      this.paginate.length = response.data.total
      this.tbl_configuraciones = response.data.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Configuraciones')
    }
  }

  createConfiguracion() {
    const modal = this.modalService.open(ModalConfiguracionDetallesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.cmb_periodo = this.cmb_periodo
    modal.componentInstance.cmb_modulo = this.cmb_modulo
    // modal.componentInstance.cmb_tipo = this.cmb_tipo
  }

  editConfiguracion(configuracion: any) {
    const modal = this.modalService.open(ModalConfiguracionDetallesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.cmb_periodo = this.cmb_periodo
    modal.componentInstance.cmb_modulo = this.cmb_modulo
    // modal.componentInstance.cmb_tipo = this.cmb_tipo
    modal.componentInstance.configuracion = configuracion
  }

  clearFilter() {
    Object.assign(this.filter, {
      periodo: null,
      modulo: null,
      codigo: null,
      tipo: null,
      estado: null,
    })
    // this.cmb_tipo_filtered = []
  }

  handleSelectModulo({id_catalogo, tipo, valor, descripcion}) {
    // console.log(event)
    Object.assign(this.filter, { codigo: null, tipo: null })
    // this.cmb_tipo_filtered = this.cmb_tipo.filter((element: any) => element.grupo == valor)
  }

}
