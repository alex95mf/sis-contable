import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { FacturasService } from '../facturas.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-busqueda-factura',
  templateUrl: './modal-busqueda-factura.component.html',
  styleUrls: ['./modal-busqueda-factura.component.scss']
})
export class ModalBusquedaFacturaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  filter: any = {
    razon_social: null,
    tipo: 'FAC',
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }
  paginate: any = {
    page: 1,
    pageIndex: 0,
    length: 0,
    perPage: 7
  }

  tbl_facturas: any[] = [];

  constructor(
    private apiService: FacturasService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: "btnModalBusquedaFactura",
        paramAccion: "",
        boton: {icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnModalBusquedaFactura",
        paramAccion: "",
        boton: {icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnModalBusquedaFactura",
        paramAccion: "",
        boton: {icon: "fas fa-window-close", texto: "CERRAR" },
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
    setTimeout(() => this.getFacturas(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, { page: pageIndex + 1 })
    //
    this.getFacturas()
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    //
    this.getFacturas()
  }

  async getFacturas() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Facturas'
      let facturas = await this.apiService.getFacturasGeneradas({params: { filter: this.filter, paginate: this.paginate }}).toPromise<any>()
      this.paginate.length = facturas.data.total
      this.tbl_facturas = facturas.data.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  selectOption(documento: any) {
    this.apiService.facturaSelected$.emit(documento)
    this.activeModal.close()
  }

  clearFilter() {
    Object.assign(this.filter, {
      razon_social: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    })
  }

}
