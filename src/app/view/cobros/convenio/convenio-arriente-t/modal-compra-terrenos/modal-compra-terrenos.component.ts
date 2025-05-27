import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { format } from 'date-fns';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ConvenioArrienteTService } from '../convenio-arriente-t.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-compra-terrenos',
  templateUrl: './modal-compra-terrenos.component.html',
  styleUrls: ['./modal-compra-terrenos.component.scss']
})
export class ModalCompraTerrenosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  msgSpinner: string;
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

  tbl_compraTerreno: any[] = []

  constructor(
    private apiService: ConvenioArrienteTService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsModalArriendos', paramAccion: '', boton: {icon: 'fas fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
    ]
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'CONSULTAR':
        this.consultar()
        break;
      case 'LIMPIAR':
        this.clearFilter()
        break;
      case 'CERRAR':
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.filter.razon_social = this.contribuyente.razon_social
    setTimeout(() => this.getCompraTerreno(), 0)
  }

  consultar() {
    Object.assign(this.paginate, {pageIndex: 0, page: 1})
    this.paginator.firstPage()
    this.getCompraTerreno()
  }

  changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.getCompraTerreno()
  }

  async getCompraTerreno() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando documentos de Arriendo'
      const response = await this.apiService.getCompraTerreno({concepto: {codigo: 'CT'}, params: {filter: this.filter, paginate: this.paginate}})
      console.log(response.data)
      this.paginate.length = response.data.total
      this.tbl_compraTerreno = response.data.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Compras de Terreno')
    }
  }

  seleccionarDocumento(documento) {
    this.apiService.selectCompraTerreno$.emit(documento)
    this.activeModal.close()
  }

  clearFilter() {
    Object.assign(this.filter, {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      razon_social: null,
      num_documento: null,
    })
  }

}
