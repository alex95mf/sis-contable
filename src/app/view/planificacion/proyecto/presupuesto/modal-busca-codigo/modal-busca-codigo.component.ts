import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';

import { PresupuestoService } from '../presupuesto.service';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-modal-busca-codigo',
  templateUrl: './modal-busca-codigo.component.html',
  styleUrls: ['./modal-busca-codigo.component.scss']
})
export class ModalBuscaCodigoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() bien
  @Input() query
  mensajeSpinner: string
  vmButtons: Botonera[] = []

  filter: any = {
    codigo: null,
    nombre: null,
  }
  paginate: any = {
    length: 0,
    perPage: 7,
    page: 1,
    pageIndex: 0,
  }

  resultados: any[] = []

  constructor(
    private toastr: ToastrService, 
    private activeModal: NgbActiveModal, 
    private commonVarService: CommonVarService, 
    private apiService: PresupuestoService
  ) {
    this.vmButtons = [
      {
        orig: "btnsBusqCPC",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsBusqCPC",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCodigosPresupuesto()
    }, 50)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "CONSULTAR":
        this.consultar()
        break;

      default:
        break;
    }
  }

  /**
   * Obtiene los Codigos Presupuestarios que se ajusten al parametro de busqueda
   * @param query Parametro de busqueda para Codigos Presupuestarios
   */
  async getCodigosPresupuesto() {
    const data = {
      // Para filtrado y pagineo
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.resultados = []
    this.lcargando.ctlSpinner(true);

    try {
      (this as any).mensajeSpinner = 'Obteniendo Codigos'
      const response = await this.apiService.getCodigos(data)
      this.paginate.length = response.total
      this.resultados = response.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Codigos')
    }
  }

  changePaginate(event) {
    Object.assign(this.paginate, {page: event.pageIndex + 1});
    this.getCodigosPresupuesto();
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.getCodigosPresupuesto()
  }

  seleccionaCodigo(linea) {
    this.apiService.selectCodigoPresupuesto$.next({ bien: this.bien, codigo_presupuesto: linea})
    this.activeModal.close()
  }

}
