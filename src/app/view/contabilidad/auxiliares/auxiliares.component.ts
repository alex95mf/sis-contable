import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuxiliaresService } from './auxiliares.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { IAuxuliar, IOption, IPaginate } from './IAuxiliares';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalCreateComponent } from './modal-create/modal-create.component';

@Component({
standalone: false,
  selector: 'app-auxiliares',
  templateUrl: './auxiliares.component.html',
  styleUrls: ['./auxiliares.component.scss']
})
export class AuxiliaresComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Mantenimiento de Auxiliares';
  vmButtons: Array<Botonera> = [];
  mensajeSpinner: string;

  filter: any;
  paginate: IPaginate;

  cmb_auxiliar_tipo: Array<IOption>;
  cmb_auxiliar_referencia: Array<IOption>;
  cmb_auxiliar_naturaleza: Array<IOption>;
  lst_auxiliares: Array<IAuxuliar> = [];

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private apiService: AuxiliaresService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsConAuxiliares',
        paramAccion: '',
        boton: { icon: 'fas fa-plus-square', texto: 'NUEVO' },
        clase: 'btn btn-sm btn-success',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
      {
        orig: 'btnsConAuxiliares',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
      {
        orig: 'btnsConAuxiliares',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
    ];

    this.filter = {
      tipo: null,
      referencia: null,
      naturaleza: null,
    }

    this.paginate = {
      pageSize: 15,
      page: 1,
      pageIndex: 0,
      length: 100,
      pageSizeOptions: [10, 15, 20]
    }

    this.cmb_auxiliar_naturaleza = [
      { value: 'C', label: 'CREDITO' },
      { value: 'D', label: 'DEBITO' },
    ]

    this.apiService.auxiliarStore$.subscribe(() => this.getAuxiliares())
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "NUEVO":
        this.expandModalNuevo()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Catalogos'
      let response = await this.apiService.getCatalogos({params: "'CON_TIPO_AUXILIARES','CON_CATALOGO_AUXILIARES'"});
      this.cmb_auxiliar_tipo = response['CON_TIPO_AUXILIARES'].map((item: any) => Object.assign(item, { label: `${item.valor}. ${item.descripcion}`}))
      this.cmb_auxiliar_referencia = response['CON_CATALOGO_AUXILIARES'].map((item: any) => Object.assign(item, { label: `${item.valor}. ${item.descripcion}`}))

      this.lcargando.ctlSpinner(false)
      this.getAuxiliares()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.getAuxiliares()
  }

  async getAuxiliares() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Auxiliares'
      let response: any = await this.apiService.getAuxiliares({params: { filter: this.filter, paginate: this.paginate }})
      this.lst_auxiliares = response.data
      this.paginate.length = response.total

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Auxiliares')
    }
  }

  changePage({ pageSize, pageIndex }) {
    Object.assign(this.paginate, { pageSize, page: pageIndex + 1 })
    this.getAuxiliares()
  }

  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick())
    this.selects[0].focus()
  }

  expandModalNuevo(auxiliar?: IAuxuliar) {
    const modal = this.modalService.open(ModalCreateComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.cmb_tipo = this.cmb_auxiliar_tipo
    modal.componentInstance.cmb_referencia = this.cmb_auxiliar_referencia
    modal.componentInstance.cmb_naturaleza = this.cmb_auxiliar_naturaleza
    if (auxiliar) modal.componentInstance.auxiliar = auxiliar;
  }

}
