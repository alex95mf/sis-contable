import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { LiquidacionPrService } from '../liquidacion-pr.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-liquidaciones',
  templateUrl: './modal-liquidaciones.component.html',
  styleUrls: ['./modal-liquidaciones.component.scss']
})
export class ModalLiquidacionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[];

  filter: any = {
    razon_social: null,
    num_documento: null,
    fecha_desde: null,
    fecha_hasta: null
  }

  paginate: any = {
    pageIndex: 0,
    page: 1,
    perPage: 7,
    length: 0,
  }

  lst_liquidaciones: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: LiquidacionPrService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalLiquidaciones',
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
        orig: 'btnsModalLiquidaciones',
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
      case "CERRAR":
        this.activeModal.close()
        break;
      case "CONSULTAR":
        this.consultar()
        break;
    
      default:
        break;
    }
  }

  changePage(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1})
    this.getLiquidaciones()
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0})
    this.getLiquidaciones()
  }

  async getLiquidaciones() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Liquidaciones'
      let liquidaciones = await this.apiService.getLiquidaciones({params: { filter: this.filter, paginate: this.paginate }})
      console.log(liquidaciones)
      this.paginate.length = liquidaciones.total
      this.lst_liquidaciones = liquidaciones.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Liquidaciones')
    }
  }


  selectRow(liquidacion: any) {
    this.apiService.liquidacionSelected$.emit(liquidacion)
    this.activeModal.close()
  }

}
