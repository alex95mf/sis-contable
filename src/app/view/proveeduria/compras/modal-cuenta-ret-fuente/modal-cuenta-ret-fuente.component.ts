import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ComprasService } from '../compras.service';

interface CuentaContable {
  codigo: string
  nombre: string
  tipo: string
}

@Component({
standalone: false,
  selector: 'app-modal-cuenta-ret-fuente',
  templateUrl: './modal-cuenta-ret-fuente.component.html',
  styleUrls: ['./modal-cuenta-ret-fuente.component.scss']
})
export class ModalCuentaRetFuenteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  @ViewChild(MatPaginator) paginator: MatPaginator
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  tbl_cuentas: CuentaContable[] = [];

  filter: any = {
    codigo: null,
    nombre: null,
  }
  paginate: any = {
    page: 1,
    length: 0,
    perPage: 10,
    pageIndex: 0,
  }

  constructor(
    private apiService: ComprasService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {orig: 'btnsModalCuentasPorPagar', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {orig: 'btnsModalCuentasPorPagar', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {orig: 'btnsModalCuentasPorPagar', paramAccion: '', boton: {icon: 'fas fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getCuentas()
      this.lcargando.ctlSpinner(false)
    })
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFiltros()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  async consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.lcargando.ctlSpinner(true)
    await this.getCuentas()
    this.lcargando.ctlSpinner(false)
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.lcargando.ctlSpinner(true)
    await this.getCuentas()
    this.lcargando.ctlSpinner(false)
  }

  async getCuentas() {
    try {
      const response = await this.apiService.getCuentasRetFte({params: {filter: this.filter, paginate: this.paginate}});
      console.log(response)
      this.tbl_cuentas = response.data.data
      this.paginate.length = response.data.total
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Cuentas')
    }
  }

  clearFiltros() {
    Object.assign(this.filter, {
      codigo: null,
      nombre: null,
    })
  }

  selectCuenta(cuenta: CuentaContable) {
    this.apiService.retfteSelected$.emit(cuenta)
    this.activeModal.close()
  }

}
