import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { PrestamosService } from '../prestamos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-consulta-prestamos',
  templateUrl: './modal-consulta-prestamos.component.html',
  styleUrls: ['./modal-consulta-prestamos.component.scss']
})
export class ModalConsultaPrestamosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  filter: any = {
    empleado: {emp_nombre_query: null},
    fecha_inicio: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    fecha_final: moment().endOf('year').format('YYYY-MM-DD'),
    documento: null,
  }
  paginate: any = {
    perPage: 5,
    page: 1,
    pageIndex: 0,
    length: 0,
  }

  tbl_prestamos: any[] = []

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: PrestamosService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {orig: 'btnsModalConsultaPrestamos', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      {orig: 'btnsModalConsultaPrestamos', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      {orig: 'btnsModalConsultaPrestamos', paramAccion: '', boton: {icon: 'far fa-window-close', texto: 'CANCELAR'}, clase: 'btn btn-sm btn-danger', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
    ]
  }

  ngOnInit(): void {
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFiltros()
        break;
      case "CANCELAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  consultar = () => {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    //
    this.getPrestamos()
  }

  changePage = ({pageIndex, pageSize}) => {
    Object.assign(this.paginate, {perPage: pageSize, page: pageIndex + 1})
    //
    this.getPrestamos()
  }

  getPrestamos = async () => {
    this.lcargando.ctlSpinner(true)
    try {
      const response: any = await this.apiService.consultarPrestamos({params: {filter: this.filter, paginate: this.paginate}})
      console.log(response)
      Object.assign(this.paginate, { length: response.total })
      this.tbl_prestamos = response.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Prestamos')
    }
  }

  clearFiltros = () => {
    Object.assign(this.filter, {
      empleado: {emp_nombre_query: null},
      fecha_inicio: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      fecha_final: moment().endOf('year').format('YYYY-MM-DD'),
      documento: null,
    })
  }

  handleSelectPrestamo = (element: any) => {
    this.apiService.prestamoSelected$.emit(element)
    this.activeModal.close()
  }

}
