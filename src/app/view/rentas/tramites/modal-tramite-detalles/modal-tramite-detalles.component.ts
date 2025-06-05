import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { TramitesService } from '../tramites.service';

@Component({
standalone: false,
  selector: 'app-modal-tramite-detalles',
  templateUrl: './modal-tramite-detalles.component.html',
  styleUrls: ['./modal-tramite-detalles.component.scss']
})
export class ModalTramiteDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() nuevo: boolean
  @Input() data: any
  mensajeSpinner: string
  vmButtons: any[]

  departamentos: any[] = []
  tipo_documento: any[] = [
    { id: 'OFI', nombre: 'OFICIO' },
    { id: 'MMO', nombre: 'MEMO' },
    { id: 'CIR', nombre: 'CIRCULAR' },
    { id: 'RES', nombre: 'RESOLUCION' },
    { id: 'CER', nombre: 'CERTIFICADO' },
    { id: 'LIQ', nombre: 'LIQUIDACION' },
    { id: 'DOC', nombre: 'DOCUMENTACION' },
    { id: 'EXP', nombre: 'EXPEDIENTE' },
    { id: 'FOR', nombre: 'FORMULARIO' },
    { id: 'SOL', nombre: 'SOLICITUD' },
    { id: 'EGB', nombre: 'EGRESO BODEGA' },
    { id: 'TRA', nombre: 'TRAMITE' },
    { id: 'INS', nombre: 'INSPECCION' },
  ]
  disposiciones: any[] = [
    { id: 'PRO', nombre: 'PROCEDER' },
    { id: 'ARC', nombre: 'ARCHIVAR' },
    { id: 'RES', nombre: 'RESPONDER' },
    { id: 'VER', nombre: 'VERIFICAR' },
    { id: 'EMI', nombre: 'EMITIR' },
    { id: 'ASI', nombre: 'ASISTIR' },
    { id: 'FIR', nombre: 'FIRMAR' },
  ]

  tramite: any = {
    tipo_documento: null,
    numero_documento: null,
    fecha_documento: moment().format('YYYY-MM-DD'),
    fecha_recibido: moment().format('YYYY-MM-DD'),
    hora_recibido: moment().format('HH:mm'),
    fk_departamento: null,
    tema: null,
    destino: null,
    fecha_entrega: null,
    hora_entrega: null,
    disposicion: null
  }

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: TramitesService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsRenTramitesModal",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenTramitesModal",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenTramitesModal",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCatalogos()
    }, 50)

    if (!this.nuevo) {
      this.vmButtons[0].habilitar = true
    } else {
      this.vmButtons[1].habilitar = true
    }
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setTramite()
        break;

      case "MODIFICAR":
        this.updateTramite()
        break;

      case "CANCELAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getCatalogos({ params: "'PLA_DEPARTAMENTO'" }).subscribe(
      (res: any) => {
        console.log(res)
        res.data.PLA_DEPARTAMENTO.forEach((element: any) => {
          const { id_catalogo, valor, descripcion } = element
          this.departamentos = [...this.departamentos, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        });
        this.lcargando.ctlSpinner(false)
        if (!this.nuevo) {
          setTimeout(() => {
            this.getTramite()
          }, 125)
        }
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  getTramite() {
    (this as any).mensajeSpinner = 'Cargando Tramite'
    this.lcargando.ctlSpinner(true)
    this.apiService.getTramite(this.data.id_tramite).subscribe(
      (res: any) => {
        console.log(res)
        this.tramite = res.data
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Tramite')
      }
    )
  }

  setTramite() {
    (this as any).mensajeSpinner = 'Almacenando Tramite'
    this.lcargando.ctlSpinner(true)
    this.apiService.setTramite({ tramite: this.tramite }).subscribe(
      (res: any) => {
        console.log(res)
        this.lcargando.ctlSpinner(false)
        this.apiService.newTramite$.emit(res.data)
        this.activeModal.close()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Tramite')
      }
    )
  }

  updateTramite() {
    (this as any).mensajeSpinner = 'Actualizando Tramite'
    this.lcargando.ctlSpinner(true)
    delete this.tramite.departamento
    this.apiService.updateTramite(this.tramite.id_tramite, { tramite: this.tramite }).subscribe(
      (res: any) => {
        console.log(res)
        this.lcargando.ctlSpinner(false)
        this.apiService.updateTramite$.emit(res.data)
        this.activeModal.close()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error actualizando Tramite')
      }
    )
  }

}
