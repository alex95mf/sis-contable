import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { JuiciosService } from '../juicios.service';

@Component({
  selector: 'app-modal-citacion',
  templateUrl: './modal-citacion.component.html',
  styleUrls: ['./modal-citacion.component.scss']
})
export class ModalCitacionComponent implements OnInit {
  @Input() juicio: any
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  msgSpinner: string
  fTitle: string = 'Registrar Citación'
  vmButtons: any[] = []

  notificadores: any[] = [ ]
  estados: any[] = [
    { id: 'R', label: 'Recibido' },
    { id: 'N', label: 'No Recibido' },
    { id: 'F', label: 'Fijado' },
  ]

  actuacion: any = {
    tipo: 'CITACION',
    fecha: moment().format('YYYY-MM-DD'),
    notificador: null,
    persona: null,
    observacion: null,
    estado_c: null,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: JuiciosService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsJuicioCitacion",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsJuicioCitacion",
        paramAction: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    setTimeout(() => {
      this.cargarCatalogos()
    }, 75);

    // console.log(this.juicio)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.registrar()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
    }
  }

  cargarCatalogos() {
    this.msgSpinner = 'Cargando datos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getCatalogs({ params: "'TIPO_NOTIFICADOR'"}).subscribe(
      (res: any) => {
        // console.log(res)
        res.data.TIPO_NOTIFICADOR.forEach((e: any) => {
          const { id_catalogo, descripcion } = e
          this.notificadores = [...this.notificadores, { value: id_catalogo, label: descripcion }]
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando datos')
      }
    )
  }

  registrar() {
    let msgInvalid = ''

    if (this.actuacion.notificador == null) msgInvalid += "* No ha seleccionado un Notificador<br>"
    if (this.actuacion.persona == null || this.actuacion.persona?.trim().length == 0) msgInvalid += "* No ha ingresado persona que recibe<br>"
    if (this.actuacion.observacion == null || this.actuacion.observacion?.trim().length == 0) msgInvalid += "* No ha ingresado una observacion<br>"
    // if (moment(this.actuacion.fecha).diff(moment()) > 0) msgInvalid += "* Fecha Invalida<br>"

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    Object.assign(
      this.actuacion, 
      { observaciones: `${this.actuacion.observacion} | ${this.estados.find(e => e.id == this.actuacion.estado_c).label} | ${this.actuacion.fecha} | ${this.notificadores.find(e => e.value == this.actuacion.notificador).label}` }
    )
    
    this.msgSpinner = 'Registrando Citacion'
    this.lcargando.ctlSpinner(true)
    this.apiService.saveCitacion({juicio: this.juicio, citacion: this.actuacion}).subscribe(
      (res: any) => {
        console.log(res)
        this.commonVarService.updateCitaciones.next({juicio: this.juicio, citacion: res.data})
        this.lcargando.ctlSpinner(false)
        this.activeModal.close()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Notificacion')
      }
    )
  }

}
