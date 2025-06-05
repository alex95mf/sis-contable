import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';

import { ComprasService } from '../compras.service';

@Component({
standalone: false,
  selector: 'app-modal-codigo-compras',
  templateUrl: './modal-codigo-compras.component.html',
  styleUrls: ['./modal-codigo-compras.component.scss']
})
export class ModalCodigoComprasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() bien
  @Input() query
  fTitle = 'Busqueda de Codigo de Compras Publicas'
  mensajeSpinner: string
  vmButtons: any[] = []

  filter: any = {
    codigo: null,
    nombre: null,
  }
  paginate: any = {
    length: 0,
    perPage: 7,
    page: 1,
  }

  resultados: any[] = []

  constructor(
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: ComprasService
  ) { }

  ngOnInit(): void {
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
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
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
      }
    ]

    setTimeout(() => {
      this.getCodigoCompras()
    }, 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {

      case "CONSULTAR":
        this.consultar();
        break;

        case "LIMPIAR":
          this.limpiarFiltro();
          break;


      case "REGRESAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  /**
   * Obtiene los Codigos CPC que se ajusten al parametro de busqueda
   * @param query Parametro de busqueda para Codigos CPC
   */
  async getCodigoCompras() {
    this.resultados = []
    (this as any).mensajeSpinner = 'Obteniendo Codigos'
    this.lcargando.ctlSpinner(true)

    let response: any = await this.apiService.getCodigosCompras({params: {filter: this.filter, paginate: this.paginate}});
    this.paginate.length = response.total
    this.resultados = response.data
    this.lcargando.ctlSpinner(false)


    /* this.apiService.getCodigos({params: {filter: this.filter, paginate: this.paginate}}).subscribe(
      (res: any) => {
        // console.log(res['data'])  // Respuesta paginada
        this.paginate.length = res.data.total;  // Obtiene la longitud total de resultados
        res.data.data.forEach((element: any) => {
          const { codigo, tipo, nombre, descripcion_general } = element
          this.resultados.push({
            codigo: codigo,
            tipo: tipo,
            nombre: nombre,
            descripcion_general: descripcion_general
          })
        });
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Codigos')
      }
    ) */
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getCodigoCompras();
  }

  consultar() {
    Object.assign(
      this.paginate,
      { page: 1 }
    )
    this.getCodigoCompras()
  }

  limpiarFiltro() {
    this.filter = {
      codigo: null,
      nombre: null,
    }
  }

  seleccionaCPC(linea) {
    this.apiService.codComprasSelected$.next({ bien: this.bien, codigo_cpc: linea })
    this.activeModal.close()
  }

}
