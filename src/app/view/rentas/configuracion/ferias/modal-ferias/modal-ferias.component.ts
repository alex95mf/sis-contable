import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { FeriasService } from '../ferias.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Botonera from 'src/app/models/IBotonera';
import { ModalContribuyenteComponent } from '../modal-contribuyente/modal-contribuyente.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';

interface Feria {
  id?: number
  nombre: string,
  fk_contribuyente: number
  fecha_inicio: string
  fecha_finalizacion: string
  descripcion: string
  estado: string
  contribuyente?: Contribuyente
}

interface Contribuyente {
  id_cliente?: number
  razon_social: string
  tipo_documento: string
  num_documento: string
}

@Component({
standalone: false,
  selector: 'app-modal-ferias',
  templateUrl: './modal-ferias.component.html',
  styleUrls: ['./modal-ferias.component.scss']
})
export class ModalFeriasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() feria_id: number;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[];

  feria: Feria = {
    nombre: null,
    fk_contribuyente: null,
    fecha_inicio: null,
    fecha_finalizacion: null,
    descripcion: null,
    estado: 'A'
  };
  contribuyente: Contribuyente = {
    razon_social: null,
    tipo_documento: null,
    num_documento: null,
  }

  cmb_estado: any[] = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ]

  constructor(
    private apiService: FeriasService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalFerias',
        paramAccion: '',
        boton: { icon: 'far fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsModalFerias',
        paramAccion: '',
        boton: { icon: 'far fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: true,
      },
      {
        orig: 'btnsModalFerias',
        paramAccion: '',
        boton: { icon: 'far fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]

    this.apiService.selectContribuyente$.subscribe(
      ({id_cliente, razon_social, tipo_documento, num_documento}) => {
        this.contribuyente = { id_cliente, razon_social, tipo_documento, num_documento}
        this.feria.fk_contribuyente = id_cliente
      }
    )
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      if (this.feria_id) {
        //Cargar Feria
        await this.getFeria(this.feria_id)
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
      }
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.lcargando.ctlSpinner(true)
        await this.setFeria()
        this.lcargando.ctlSpinner(false)
        break;
      case "MODIFICAR":
        this.lcargando.ctlSpinner(true)
        await this.updateFeria()
        this.lcargando.ctlSpinner(false)
        break;
      case "CERRAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  buscarContribuyente() {
    this.modalService.open(ModalContribuyenteComponent, { size: 'xl', backdrop: 'static' })
  }

  async getFeria(id: number) {
    try {
      (this as any).mensajeSpinner = 'Cargando Feria'
      let feria = await this.apiService.getFeria(id)
      console.log(feria)
      this.feria = feria
      this.contribuyente = feria.contribuyente
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Feria')
    }
  }

  async setFeria() {
    let message = ''

    if (this.feria.nombre == null, this.feria.nombre.trim() == '') message += '* Nombre de la Feria no puede estar vacio.<br>'
    if (moment(this.feria.fecha_finalizacion).diff(moment(this.feria.fecha_inicio)) < 0) message += '* Rango de Fechas invalido.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
      return;
    }

    try {
      (this as any).mensajeSpinner = 'Almacenando Feria'
      let feria = await this.apiService.setFeria({feria: this.feria})
      console.log(feria)
      Swal.fire('Feria almacenada correctamente', '', 'success').then(() => {
        this.apiService.createTable$.emit(feria)
        this.activeModal.close()
      })
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Feria')
    }
  }

  async updateFeria() {
    try {
      (this as any).mensajeSpinner = 'Actualizando Feria'
      let feria = await this.apiService.updateFeria(this.feria.id, {feria: this.feria})
      console.log(feria)
      Swal.fire('Feria actualizada correctamente', '', 'success').then(() => {
        this.apiService.updateTable$.emit(feria)
        this.activeModal.close()
      })
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error actualizando Feria')
    }
  }
}
