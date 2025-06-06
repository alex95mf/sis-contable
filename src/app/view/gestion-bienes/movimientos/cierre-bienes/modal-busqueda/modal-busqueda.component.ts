import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { CierreBienesService } from '../cierre-bienes.service';


@Component({
standalone: false,
  selector: 'app-modal-busqueda',
  templateUrl: './modal-busqueda.component.html',
  styleUrls: ['./modal-busqueda.component.scss']
})
export class ModalBusquedaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() cmb_tipo_bien: any[]
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[];

  tipoBienSelected: any|null = null
  filter: any = {
    num_documento: null,
    fecha_desde: null,
    fecha_hasta: null,
  }
  paginate: any = {
    pageIndex: 0,
    page: 1,
    perPage: 10,
    length: 0,
  }

  lst_cierres: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: CierreBienesService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalBusqueda',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsModalBusqueda',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsModalBusqueda',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    // setTimeout(() => this.getCierres(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'CONSULTAR':
        this.consultar()
        break;
      case 'CERRAR':
        this.activeModal.close()
        break;
      case 'LIMPIAR':
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { page: 0, pageIndex: 0})
    this.getCierres()
  }

  changePage({pageIndex}: PageEvent) {
    Object.assign(this.paginate, { page: pageIndex + 1})
    this.getCierres()
  }

  async getCierres() {
    if (this.tipoBienSelected == null) {
      this.toastr.warning('No ha seleccionado un Tipo de Bien')
      return;
    }

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Cierres'
      let documentos = await this.apiService.getCierres({tipo: this.tipoBienSelected, params: {filter: this.filter, paginate: this.paginate}})
      console.log(documentos);
      this.paginate.length = documentos.total
      this.lst_cierres = documentos.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  selectRow(cierre: any) {
    this.apiService.cierreSelected$.emit(cierre)
    this.activeModal.close()
  }

  clearFilter() {
    Object.assign(this.filter, {
      num_documento: null,
      fecha_desde: null,
      fecha_hasta: null,
    })
  }

}
