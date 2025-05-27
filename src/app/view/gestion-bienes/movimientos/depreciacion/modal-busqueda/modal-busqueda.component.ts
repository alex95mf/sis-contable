import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { DepreciacionService } from '../depreciacion.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-modal-busqueda',
  templateUrl: './modal-busqueda.component.html',
  styleUrls: ['./modal-busqueda.component.scss']
})
export class ModalBusquedaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  fTitle: string = "Busqueda de Documentos de Depreciación"
  vmButtons: any[] = [];

  filter: any = {
    num_documento: null,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }
  paginate: any = {
    perPage: 10,
    pageIndex: 0,
    page: 1,
    length: 0,
    pageSizeOptions: [5, 10, 15]
  }

  depreciaciones: any[] = []

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: DepreciacionService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsBusquedaDepreciacion",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBusquedaDepreciacion",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBusquedaDepreciacion",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    setTimeout(() => {
      this.getDepreciaciones()
    }, 50)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFilter()
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1})
    this.getDepreciaciones()
  }

  getDepreciaciones() {
    this.msgSpinner = 'Cargando Depreciaciones'
    this.lcargando.ctlSpinner(true)

    this.apiService.getDepreciaciones({filter: this.filter, paginate: this.paginate}).subscribe(
      (res: any) => {
        // console.log(res)
        const { total, current_page } = res.data
        Object.assign(this.paginate, { length: total, page: current_page })
        this.depreciaciones = res.data.data
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.warning(err.error.message, 'Error cargando Depreciaciones')
      }
    )
  }

  selectDepreciacion(depreciacion: any) {
    this.apiService.depreciacion$.emit(depreciacion)
    this.activeModal.close()
  }

  changePaginate(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1 })
    this.getDepreciaciones()
  }

  limpiarFilter() {
    Object.assign(this.filter, {
      num_documento: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    })
  }
}
