import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import Botonera from 'src/app/models/IBotonera';
import { NotificacionesService } from '../notificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.scss'],
  providers: [DialogService],
})
export class ModalDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  vmButtons: Botonera[] = []

  @Input() lst_modulo: any;
  @Input() lst_tipo_notificacion: any;
  lst_tipo_filter: any[] = [];
  @Input() notificacion: any;
  registro: any = {
    id: null,
    fk_modulo: null,
    modulo: null,
    fk_tipo_notificacion: null,
    tipo_notificacion: null,
    fk_empleado: null,
    empleado_full_nombre: null,
    correo: null,
  }

  constructor(
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    public dialogService: DialogService,
    private apiService: NotificacionesService,
  ) {
    this.vmButtons = [
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-plus-square', texto: 'GUARDAR'}, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-edit', texto: 'MODIFICAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true},
      {orig: 'btnsNotificacionesModal', paramAccion: '', boton: {icon: 'far fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
    ]
  }

  ngOnInit(): void {

    this.lst_tipo_filter = this.lst_tipo_notificacion;
    if (this.notificacion) {
      Object.assign(this.registro, this.notificacion)
      this.lst_tipo_filter = this.lst_tipo_notificacion;
      //;.filter((element: any) => element.grupo == this.registro.modulo)
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
        this.lcargando.ctlSpinner(true)
        await this.setNotificacion()
        this.lcargando.ctlSpinner(false)
        this.activeModal.close()
        Swal.fire('Configuracion de Notificacion almacenado', '', 'success')
        break;
      case "MODIFICAR":
        this.lcargando.ctlSpinner(true)
        await this.updateNotificacion()
        this.lcargando.ctlSpinner(false)
        this.activeModal.close()
        Swal.fire('Configuracion de Notificacion actualizado', '', 'success')
        break;
    
      default:
        break;
    }
  }

  async setNotificacion() {
    try {
      this.msgSpinner = 'Almacenando Notificacion'
      const response = await this.apiService.setNotificacion({notificacion: this.registro})
      console.log(response)
      this.apiService.setNotificacion$.emit()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Notificacion')
    }
  }

  async updateNotificacion() {
    try {
      this.msgSpinner = 'Almacenando Notificacion'
      const response = await this.apiService.updateNotificacion(this.registro.id, {notificacion: this.registro})
      console.log(response)
      this.apiService.setNotificacion$.emit()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error actualizando Notificacion')
    }
  }

  handleSelectModulo({id_modulo, nombre}) {
    Object.assign(this.registro, {fk_modulo: id_modulo, modulo: nombre})
    //this.lst_tipo_filter = this.lst_tipo_notificacion;//.filter((element: any) => element.grupo == nombre)
  }

  handleSelectTipo({id_catalogo, valor}) {
    Object.assign(this.registro, {fk_tipo_notificacion: id_catalogo, tipo_notificacion: valor})
  }

  searchEmpleado() {
    const dialog = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: 'not',
        relation_selected: '',
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    dialog.onClose.subscribe(
      (empleado: any) => {
        if (empleado != undefined) {
          Object.assign(this.registro, {
            fk_empleado: empleado.id_empleado,
            empleado_full_nombre: empleado.emp_full_nombre,
            correo: empleado.emp_correo_empresarial ?? empleado.emp_correo
          })
        }
      }
    )
  }

}
