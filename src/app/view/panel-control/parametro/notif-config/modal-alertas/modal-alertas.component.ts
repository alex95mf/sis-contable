import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { NotifConfigService } from '../notif-config.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ModalUsuariosComponent } from 'src/app/config/custom/modal-usuarios/modal-usuarios.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-alertas',
  templateUrl: './modal-alertas.component.html',
  styleUrls: ['./modal-alertas.component.scss']
})
export class ModalAlertasComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  vmButtons: Botonera[] = []

  @Input() lst_modulo: any;
  @Input() lst_tipo_notificacion: any;
  lst_tipo_filter: any[] = [];
  @Input() alerta: any;
  registro: any = {
    id: null,
    fk_modulo: null,
    modulo: null,
    fk_tipo_alerta: null,
    tipo_alerta: null,
    fk_usuario: null,
    nombre: null,
  }

  onDestory = new Subject();

  constructor(
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private apiService: NotifConfigService,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
  ) {
    this.vmButtons = [
      {orig: 'btnsAlertasModal', paramAccion: '', boton: {icon: 'far fa-plus-square', texto: 'GUARDAR'}, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      {orig: 'btnsAlertasModal', paramAccion: '', boton: {icon: 'far fa-edit', texto: 'MODIFICAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true},
      {orig: 'btnsAlertasModal', paramAccion: '', boton: {icon: 'far fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
    ]

    this.commonVarService.selectUsuario.asObservable().pipe(takeUntil(this.onDestory)).subscribe(
      ({id_usuario, nombre}) => {
        Object.assign(this.registro, {fk_usuario: id_usuario, nombre})
      }
    )
  }
  ngOnDestroy(): void {
    this.onDestory.next()
    this.onDestory.complete()
  }

  ngOnInit(): void {
    this.lst_tipo_filter = this.lst_tipo_notificacion;
    if (this.alerta) {
      Object.assign(this.registro, this.alerta)
      this.lst_tipo_filter = this.lst_tipo_notificacion;//.filter((element: any) => element.grupo == this.registro.modulo)
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
        await this.setAlerta()
        this.lcargando.ctlSpinner(false)
        this.activeModal.close()
        Swal.fire('Configuracion de Alerta almacenado', '', 'success')
        break;
      case "MODIFICAR":
        this.lcargando.ctlSpinner(true)
        await this.updateAlerta()
        this.lcargando.ctlSpinner(false)
        this.activeModal.close()
        Swal.fire('Configuracion de Alerta actualizado', '', 'success')
        break;
    
      default:
        break;
    }
  }

  async setAlerta() {
    try {
      this.msgSpinner = 'Almacenando Notificacion'
      const response = await this.apiService.setAlerta({alerta: this.registro})
      console.log(response)
      this.apiService.setAlerta$.emit()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Notificacion')
    }
  }

  async updateAlerta() {
    try {
      this.msgSpinner = 'Almacenando Notificacion'
      const response = await this.apiService.updateAlerta(this.registro.id, {alerta: this.registro})
      console.log(response)
      this.apiService.setAlerta$.emit()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error actualizando Notificacion')
    }
  }

  

  handleSelectModulo({id_modulo, nombre}) {
    Object.assign(this.registro, {fk_modulo: id_modulo, modulo: nombre, fk_tipo_alerta: null, tipo_alerta: null})
   // this.lst_tipo_filter = this.lst_tipo_notificacion.filter((element: any) => element.grupo == nombre)
  }

  handleSelectTipo({id_catalogo, valor}) {
    Object.assign(this.registro, {fk_tipo_alerta: id_catalogo, tipo_alerta: valor})
  }

  searchUsuario() {
    this.modalService.open(ModalUsuariosComponent, {size: 'xl', backdrop: 'static'})
  }

}
