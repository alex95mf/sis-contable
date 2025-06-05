import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import Swal from 'sweetalert2';
import { OtrasConfiguracionesService } from '../otras-configuraciones.service';

@Component({
standalone: false,
  selector: 'app-modal-configuracion-detalles',
  templateUrl: './modal-configuracion-detalles.component.html',
  styleUrls: ['./modal-configuracion-detalles.component.scss']
})
export class ModalConfiguracionDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  vmButtons: Botonera[] = []
  fTitle: string = 'Nuevo Parametro'

  @Input() cmb_periodo: any[];
  @Input() cmb_modulo: any[];
  // @Input() cmb_tipo: any[] = []
  cmb_tipo_filtered: any[] = []
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]

  @Input() configuracion: any;

  registro = {
    id: null,
    periodo: null,
    modulo: null,
    codigo: null,
    descripcion: null,
    valor: 0,
    porcentaje: 0,
    estado: 'A'
  }

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: OtrasConfiguracionesService,
  ) {
    this.vmButtons = [
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-plus-square', texto: 'GUARDAR'}, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-edit', texto: 'MODIFICAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
    ]
  }

  ngOnInit(): void {
    if (this.configuracion) {
      Object.assign(this.registro, this.configuracion, {codigo: this.configuracion.tipo})
      // this.cmb_tipo_filtered = this.cmb_tipo.filter((element: any) => element.grupo == this.configuracion.modulo)
      this.fTitle = 'Edicion de Parametro'
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
          this.lcargando.ctlSpinner(true);
          await this.setConfiguracion()
          this.lcargando.ctlSpinner(false)
          Swal.fire('Configuracion almacenada', '', 'success').then(() => {
            // Evento de actualizacion
            this.apiService.updateConfiguracion$.emit()
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
          this.lcargando.ctlSpinner(true);
          await this.updateConfiguracion()
          this.lcargando.ctlSpinner(false)
          Swal.fire('Configuracion de Notificacion actualizado', '', 'success').then(() => {
            // Evento de actualizacion
            this.apiService.updateConfiguracion$.emit()
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
      (this as any).mensajeSpinner = 'Almacenando Configuracion'
      const response = await this.apiService.setConfiguracion({configuracion: this.registro})
      console.log(response)
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Configuracion')
    }
  }

  async updateConfiguracion() {
    try {
      (this as any).mensajeSpinner = 'Actualizando Configuracion'
      const response = await this.apiService.updateConfiguracion(this.registro.id, {configuracion: this.registro})
      console.log(response)
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error actualizando Configuracion')
    }
  }

  handleSelectModulo({id_catalogo, tipo, valor, descripcion}) {
    // console.log(event)
    Object.assign(this.registro, { codigo: null, tipo: null })
    // this.cmb_tipo_filtered = this.cmb_tipo.filter((element: any) => element.grupo == valor)
  }

}
