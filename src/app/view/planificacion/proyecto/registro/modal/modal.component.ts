import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { RegistroService } from '../registro.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() obj_programa: any
  @Input() obj_departamento: any
  @Input() obj_atribucion: any
  @Input() bien: any
  vmButtons: any
  fTitle: string = 'Ingreso de Compra'
  msgSpinner: string = ''

  cedula: string = ''
  periodo: string = new Date().getFullYear().toString()
  programa: string = '70'
  departamento: string = '14'
  secuencial: string = ''
  factura: string = ''
  cantidad: number = 0
  precio_unitario: number = 0
  precio_total: number = null
  fecha: string = moment(new Date()).format('YYYY-MM-DD')

  compras: any = []
  totales: any = {
    cantidad: 0,
    precio_total: 0
  }

  constructor(
    private activeModal: NgbActiveModal,
    private api: RegistroService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsRegCompModal", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false }
    ]

    this.precio_unitario = this.bien.costo_unitario

    setTimeout(() => {
      this.cargaCompras()
    }, 50)
  }

  cargaCompras() {
    this.compras = []
    Object.assign(
      this.totales,
      {
        cantidad: 0,
        precio_total: 0
      }
    )

    this.msgSpinner = 'Cargando Compras'
    this.lcargando.ctlSpinner(true)
    this.api.getCompras({bien: this.bien}).subscribe(
      (res: any) => {
        // console.log(res['data'])
        res['data'].forEach(element => {
          let compra = {
            id: element.id,
            cedula_asignacion: element.cedula_asignacion,
            cantidad: element.cantidad,
            precio_unitario: element.precio_unitario,
            precio_total: element.precio_total,
            fecha: element.fecha,
            pagado: element.pagado > 0,
          }
          this.totales.cantidad += element.cantidad
          this.totales.precio_total += parseFloat(element.precio_total)
          this.compras.push({...compra})
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        console.error(err)
        this.toastr.error(err.error.message, 'Error cargando Compras')
      }
    )
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  agregar() {
    if (this.secuencial == '' || this.secuencial == '0' || this.secuencial == null) {
      Swal.fire({
        title: this.fTitle,
        text: 'No ha ingresado el secuencial',
        icon: 'warning'
      })
      return
    }

    if (this.cantidad <= 0 || this.secuencial == null) {
      Swal.fire({
        title: this.fTitle,
        text: 'La cantidad no puede ser igual o menor a 0',
        icon: 'warning'
      })
      return
    }

    if (this.cantidad > (this.bien.solicitado - this.totales.cantidad)) {
      Swal.fire(this.fTitle, 'La cantidad ingresada supera la cantidad permitida a solicitar.', 'warning')
      return
    }

    if (this.precio_unitario <= 0 || this.secuencial == null) {
      Swal.fire({
        title: this.fTitle,
        text: 'El precio unitario no puede ser igual o menor a 0',
        icon: 'warning'
      })
      return
    }

    if (this.factura.trim() == '' || this.factura.trim() == null) {
      Swal.fire(this.fTitle, 'La factura no puede ser vacía.', 'warning')
      return
    }

    let compra = {
      id: null,
      fk_programa: this.obj_programa.id,
      fk_departamento: this.obj_departamento.id,
      fk_atribucion: this.obj_atribucion.id,
      fk_bien: this.bien.id,
      cedula_asignacion: `${this.periodo}-${this.obj_programa.codigo}${this.obj_departamento.codigo}-${this.secuencial.padStart(4, '0')}`,
      cantidad: this.cantidad,
      precio_unitario: this.precio_unitario,
      precio_total: this.precio_total,
      fecha: this.fecha,
      factura: this.factura,
    }

    this.msgSpinner = 'Almacenando Compras'
    this.lcargando.ctlSpinner(true)
    this.api.setCompras({compras: compra}).subscribe(
      (res: any) => {
        // console.log(res)
        this.lcargando.ctlSpinner(false)
        Swal.fire(this.fTitle, 'Ingresado exitosamente', 'success').then(() => this.cargaCompras())
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Compras')
      }
    )

    setTimeout(() => {
      this.secuencial = ''
      this.cantidad = 0
      this.precio_unitario = 0
      this.precio_total = 0
    }, 75)
  }

  // Lo usa los inputs para calcular el total de la factura
  calcular() {
    this.precio_total = this.cantidad * this.precio_unitario
  }

  calcularTotales() {
    this.totales.cantidad = this.compras.reduce((prev, curr) => parseInt(prev) + parseInt(curr.cantidad), 0)
    this.totales.precio_total = this.compras.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr.precio_total), 0)
  }

  setPagado(compra: any) {
    // console.log(compra.id)
    // return
    Swal.fire({
      text: 'Esta seguro/a de marcar esta compra como pagado?',
      title: this.fTitle,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then(
      async (result: any) => {
        if (result.isConfirmed) {
          this.msgSpinner = 'Marcando como Pagado'
          this.lcargando.ctlSpinner(true)
          try {
            let res: any = await this.api.setPagado(compra.id, compra)
            console.log(res)
            this.compras.find((compra: any) => compra.id == res.id).pagado = true
            this.lcargando.ctlSpinner(false)
            Swal.fire('Compra marcada como Pagada', '', 'success')
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err, 'Error marcando como Pagado')
          }
        }
      }
    )
  }

}
