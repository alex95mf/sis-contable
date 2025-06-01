import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReformaCodigoService } from '../reforma-codigo.service';
import Botonera from 'src/app/models/IBotonera';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-modal-busqueda-reforma-doc',
  templateUrl: './modal-busqueda-reforma-doc.component.html',
  styleUrls: ['./modal-busqueda-reforma-doc.component.scss']
})
export class ModalBusquedaReformaDocComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() periodo: any
  @Input() programa: any
  msgSpinner: string;
  fTitle: string = 'Busqueda de Reformas'
  vmButtons: Botonera[] = []

  filter: any = {
    periodo: null,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }

  paginate: any = {
    page: 1,
    pageIndex: 0,
    perPage: 7,
    length: 0,
  }

  cmb_periodo: any[] = []
  tbl_reforma: any[] = []

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ReformaCodigoService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsBusqReforma",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBusqReforma",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBusqReforma",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    Object.assign(this.filter, {
      periodo: this.periodo.periodo,
      programa: this.programa.id_catalogo,
    })
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.cargaInicial()
      await this.getReformas()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case " LIMPIAR":
        this.clearFilter()
        break;
    }
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, { page: pageIndex + 1})
    this.lcargando.ctlSpinner(true)
    await this.getReformas()
    this.lcargando.ctlSpinner(false)
  }

  async consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0})
    this.lcargando.ctlSpinner(true)
    await this.getReformas()
    this.lcargando.ctlSpinner(false)
  }

  async cargaInicial() {
    try {
      this.msgSpinner = 'Cargando Periodos'
      const periodos = await this.apiService.getPeriodos()
      console.log(periodos)
      this.cmb_periodo = periodos
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Reformas')
    }
  }

  async getReformas() {
    // this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Reformas'
      const response = await this.apiService.getReformas({params: {filter: this.filter, paginate: this.paginate}})
      // console.log(response)
      this.paginate.length = response.total
      this.tbl_reforma = response.data
      //
      // this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      // this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Reformas')
    }
  }

  clearFilter() {
    Object.assign(this.filter, {
      periodo: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    })
  }

  selectOption(reforma: any) {
    this.apiService.reformaSelected$.emit(reforma)
    this.activeModal.close()
  }

}
