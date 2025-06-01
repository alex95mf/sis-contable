import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LiquidacionCemService } from '../liquidacion-cem.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-modal-busqueda',
  templateUrl: './modal-busqueda.component.html',
  styleUrls: ['./modal-busqueda.component.scss']
})
export class ModalBusquedaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[];

  @Input() cmb_motivo: any[];

  filter: any = {
    nombre: null,
    fecha: null,
    valor_desde: null,
    valor_hasta: null,
    estado: null,
    motivo: null,
  }
  paginate: any = {
    perPage: 7,
    page: 1,
    pageIndex: 0,
    total: 0,
  }

  lst_liquidacion: any[] = [];
  displayedColumns: string[] = ['nombre', 'motivo', 'valor', 'acciones']

  cmb_estado: any[] = [
    {value: 'E', label: 'Emitido'},
    {value: 'A', label: 'Aprobado'},
    {value: 'X', label: 'Anulado'},
  ]

  constructor(
    private apiService: LiquidacionCemService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalLiquidacionesCEM',
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
        orig: 'btnsModalLiquidacionesCEM',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsModalLiquidacionesCEM',
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
    setTimeout(() => this.getLiquidaciones(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getLiquidaciones()
        break;
    
      case "LIMPIAR":
        Object.assign(this.filter, {
          nombre: null,
          fecha: null,
          valor_desde: null,
          valor_hasta: null,
          estado: null,
          motivo: null,
        })
        break;
    
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.getLiquidaciones()
  }

  async getLiquidaciones() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Buscando Liquidaciones'
      let liquidaciones = await this.apiService.getLiquidaciones({params: {filter: this.filter, paginate: this.paginate}})
      console.log(liquidaciones)
      this.paginate.total = liquidaciones.total
      this.lst_liquidacion = liquidaciones.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  selectRow(liquidacion: any) {
    this.apiService.liquidacionSelected$.emit(liquidacion)
    this.activeModal.close()
  }

}
