import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DescuentosService } from './descuentos.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ModalDescuentosComponent } from './modal-descuentos/modal-descuentos.component';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.scss']
})
export class DescuentosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = []

  tbl_porcentajes: any[] = []

  cmb_periodo: any[] = []
  cmb_concepto: any[] = []
  cmb_meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ]

  filter: any = {
    periodo: null,
    mes: null,
    concepto: null,
    fecha: null
  }
  
  paginate: any = {
    page: 1,
    pageIndex: 0,
    perPage: 20,
    length: 0,
  }
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  constructor(
    private apiService: DescuentosService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.vmButtons = [
      {orig: 'btnsDescuentosComponent', paramAccion: '', boton: {icon: '', texto: 'INICIALIZAR'}, clase: 'btn btn-sm btn-primary', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsDescuentosComponent', paramAccion: '', boton: {icon: '', texto: 'CALCULAR'}, clase: 'btn btn-sm btn-warning', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsDescuentosComponent', paramAccion: '', boton: {icon: 'fas fa-plus-square', texto: 'NUEVO'}, clase: 'btn btn-sm btn-success', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsDescuentosComponent', paramAccion: '', boton: {icon: 'fas fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
      {orig: 'btnsDescuentosComponent', paramAccion: '', boton: {icon: 'fas fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', habilitar: false, permiso: true, showbadge: false, showimg: true, showtxt: true },
    ]

    this.apiService.updateDescuentos$.subscribe(() => this.consultar())
  }

  ngOnInit(): void {
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 
    

    this.filter.fecha = moment(this.firstday).format('YYYY-MM-DD')
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'INICIALIZAR':
        this.inicializarDescuento()
        break;
      case 'CALCULAR':
        this.calcularDescuento()
        break;
      case 'NUEVO':
        this.createDescuento()
        break;
      case 'CONSULTAR':
        this.consultar()
        break;
      case 'LIMPIAR':
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    await this.cargaPeriodos()
    await this.cargaConceptos()
    await this.getDescuentos()
    this.lcargando.ctlSpinner(false)
  }

  async consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.lcargando.ctlSpinner(true)
    await this.getDescuentos()
    this.lcargando.ctlSpinner(false)
  }

  async changePage({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1})
    this.lcargando.ctlSpinner(true)
    await this.getDescuentos()
    this.lcargando.ctlSpinner(false)
  }

  async getDescuentos() {
    try {
      this.msgSpinner = 'Cargando Descuentos'
      const response = await this.apiService.getDescuentos({params: {filter: this.filter, paginate: this.paginate}})
      console.log(response)
      response.data.data.forEach((element: any) => {
        const mes_texto = this.cmb_meses.find((mes: any) => mes.value == element.mes).label
        const concepto = this.cmb_concepto.find((concepto: any) => concepto.codigo == element.codigo_concepto).nombre
        Object.assign(element, {mes_texto, concepto})
      });
      this.paginate.length = response.data.total
      this.tbl_porcentajes = response.data.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Descuentos')
    }
  }

  async cargaPeriodos() {
    try {
      this.msgSpinner = 'Cargando Periodos'
      const response = await this.apiService.getPeriodos()
      console.log(response)
      this.cmb_periodo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Periodos')
    }
  }

  async cargaConceptos() {
    try {
      this.msgSpinner = 'Cargando Periodos'
      const response = await this.apiService.getConceptos()
      console.log(response)
      this.cmb_concepto = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Periodos')
    }
  }

  createDescuento() {
    const modal = this.modalService.open(ModalDescuentosComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.cmb_periodo = this.cmb_periodo
    modal.componentInstance.cmb_meses = this.cmb_meses
    modal.componentInstance.cmb_concepto = this.cmb_concepto
  }

  editDescuento(element: any) {
    const modal = this.modalService.open(ModalDescuentosComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.cmb_periodo = this.cmb_periodo
    modal.componentInstance.cmb_meses = this.cmb_meses
    modal.componentInstance.cmb_concepto = this.cmb_concepto
    modal.componentInstance.descuento = element
  }

  clearFilter() {
    Object.assign(this.filter, {
      periodo: null,
      mes: null,
      concepto: null,
      fecha: null
    })
  }

  inicializarDescuento(){
    if(this.filter.fecha ==undefined){
      this.toastr.info('Debe seleccionar una Fecha');
    }else if(this.filter.concepto ==undefined || this.filter.concepto ==null){
      this.toastr.info('Debe seleccionar un Concepto');
    }
    else{
  
      let data = {
        anio: Number(moment(this.filter.fecha).format('YYYY')),
        mes:Number(moment(this.filter.fecha).format('MM')),
        dia:Number(moment(this.filter.fecha).format('DD')),
        concepto: this.filter.concepto,
        cuenta:''
        
      }
      console.log(data)
      this.msgSpinner = 'Inicializando Descuentos'
      this.lcargando.ctlSpinner(true);
      this.apiService.inicializarDescuentoSp(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }


  calcularDescuento(){
   if(this.filter.fecha ==undefined){
      this.toastr.info('Debe seleccionar una Fecha');
    }else if(this.filter.concepto ==undefined || this.filter.concepto ==null){
      this.toastr.info('Debe seleccionar un Concepto');
    }
    else{
  
      let data = {
        anio: Number(moment(this.filter.fecha).format('YYYY')),
        mes:Number(moment(this.filter.fecha).format('MM')),
        dia:Number(moment(this.filter.fecha).format('DD')),
        concepto: this.filter.concepto,
        cuenta:''
        
      }
      console.log(data)
      this.msgSpinner = 'Calculando Descuentos'
      this.lcargando.ctlSpinner(true);
      this.apiService.calcularDescuentoSp(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }

}
