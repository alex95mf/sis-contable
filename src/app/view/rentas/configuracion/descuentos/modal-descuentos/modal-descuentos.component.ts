import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { DescuentosService } from '../descuentos.service';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

@Component({
  selector: 'app-modal-descuentos',
  templateUrl: './modal-descuentos.component.html',
  styleUrls: ['./modal-descuentos.component.scss']
})
export class ModalDescuentosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  vmButtons: Botonera[] = []
  fTitle: string = 'Nuevo Descuento'

  @Input() cmb_periodo: any[];
  @Input() cmb_meses: any[];
  @Input() cmb_concepto: any[];

  @Input() descuento: any;

  fecha = moment()
  registro = {
    id_porcentajes_descuentos: null,
    desde: this.fecha.startOf('month').format('D'),
    hasta: this.fecha.endOf('month').format('D'),
    codigo_concepto: null,
    periodo: this.fecha.year(),
    mes: this.fecha.month() + 1,
    porcentaje: 0,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: DescuentosService,
  ) {
    this.vmButtons = [
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-plus-square', texto: 'GUARDAR'}, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-edit', texto: 'MODIFICAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
    ]
  }

  ngOnInit(): void {
    if (this.descuento) {
      Object.assign(this.registro, this.descuento)
      this.fTitle = 'Edicion de Descuento'
      this.vmButtons[0].habilitar = true
      this.vmButtons[1].habilitar = false
    }
  }

  async metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
      case "GUARDAR":
        try {
          this.lcargando.ctlSpinner(true)
          const response = await this.setConfiguracion()
          console.log(response)
          this.lcargando.ctlSpinner(false)
          Swal.fire('Configuracion almacenada', '', 'success').then(() => {
            // Evento de actualizacion
            this.apiService.updateDescuentos$.emit()
            this.activeModal.close()
          })
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error almacenando Configuracion')
        }
        
        break;
      case "MODIFICAR":
        try {
          this.lcargando.ctlSpinner(true)
          const response = await this.updateConfiguracion()
          console.log(response)
          this.lcargando.ctlSpinner(false)
          Swal.fire('Configuracion actualizada', '', 'success').then(() => {
            // Evento de actualizacion
            this.apiService.updateDescuentos$.emit()
            this.activeModal.close()
          })
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error almacenando Configuracion')
        }
        break;
    
      default:
        break;
    }
  }

  async setConfiguracion() {
    try {
      this.msgSpinner = 'Almacenando Configuracion'
      const response = await this.apiService.setDescuento({descuento: this.registro})
      console.log(response)
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Configuracion')
    }
  }

  async updateConfiguracion() {
    try {
      this.msgSpinner = 'Actualizando Configuracion'
      const response = await this.apiService.updateDescuento(this.registro.id_porcentajes_descuentos, {descuento: this.registro})
      console.log(response)
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error actualizando Configuracion')
    }
  }

  handleSelectMes({value}) {
    // console.log(event)
    this.fecha.month(value - 1)
    Object.assign(this.registro, {
      desde: this.fecha.startOf('month').format('D'), 
      hasta: this.fecha.endOf('month').format('D')
    })
  }

}
