import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { GeneracionCompraTerrenoService } from '../generacion-compra-terreno.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-modal-arriendos',
  templateUrl: './modal-arriendos.component.html',
  styleUrls: ['./modal-arriendos.component.scss']
})
export class ModalArriendosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string;
  vmButtons: Botonera[] = [];
  @Input() contribuyente: any;

  filter: any = {
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    razon_social: null,
    num_documento: null,
  }
  paginate: any = {
    pageIndex: 0,
    page: 1,
    length: 0,
    perPage: 10,
  }

  tbl_arriendos: any[] = []

  constructor(
    private apiService: GeneracionCompraTerrenoService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
    ]
  }

  ngOnInit(): void {
    this.filter.razon_social = this.contribuyente.razon_social
    setTimeout(() => this.getArriendos(), 0)
  }

  metodoGlobal(event) {
    switch(event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFiltros()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
      default:
        this.toastr.warning('Accion no definida', 'Advertencia')
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, {pageIndex: 0, page: 1})
    this.paginator.firstPage()
    this.getArriendos()
  }

  changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.getArriendos()
  }

  async getArriendos() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando documentos de Arriendo'
      const response = await this.apiService.getArriendos({concepto: {codigo: 'AR'}, params: {filter: this.filter, paginate: this.paginate}})
      console.log(response.data)
      this.paginate.length = response.data.total
      this.tbl_arriendos = response.data.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Arriendos')
    }
  }

  clearFiltros() {
    Object.assign(this.filter, {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      razon_social: null,
      num_documento: null,
    })
  }

  seleccionarDocumento(documento: any) {
    this.apiService.selectArriendo$.emit(documento)
    this.activeModal.close()
  }

}
