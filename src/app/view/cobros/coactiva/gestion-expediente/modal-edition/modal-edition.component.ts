import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';

import * as myVarGlobals from 'src/app/global';
import { GestionExpedienteService } from '../gestion-expediente.service';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss']
})
export class ModalEditionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string;
  fTitle: any = "Recepción de Notificación de Expediente";

  @Input() expediente: any;

  data: any = {
    estado: null,
    notificador: null,
    persona_recepcion: null,
    fecha_recepcion: null,
    observacion: null,
  }

  vmButtons: any;

  estados: any[] = [
    { value: 'P', label: 'Pendiente' },
    { value: 'R', label: 'Recibido' },
    { value: 'N', label: 'No Recibido' },
    { value: 'F', label: 'Fijado' },
  ]

  notificadores: any[] = [
    { value: 0, label: 'Seleccione un Notificador' },
  ]

  fotos: any = [];

  validacionDetalles: any;

  constructor(
    private commonVarService: CommonVarService,
    private commonService: CommonService,
    private modal: NgbActiveModal,
    private serviceModalDet: GestionExpedienteService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsDetalles",
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
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        
      },
    ]

    this.data.estado = this.expediente.estado

    setTimeout(() => {
      this.validacionDetalles = this.data.notificador != null
      if (!this.validacionDetalles) {
        this.data.fecha_recepcion = moment().format('YYYY-MM-DD')
      }
      this.fillCatalog();
    }, 50);
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "GUARDAR":
        this.saveDetalles();
        break;
      case "CERRAR":
        this.modal.close()
        break;
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando...";
    let data = {
      params: "'TIPO_NOTIFICADOR'",
    };
    this.serviceModalDet.getCatalogs(data).subscribe(
      (res: any) => {
        // console.log(res);
        res.data.TIPO_NOTIFICADOR.forEach((e: any) => {
          const { id_catalogo, descripcion } = e
          this.notificadores.push({ value: id_catalogo, label: descripcion})
        })
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  saveDetalles(){
    let msgInvalid = ''

    if (this.data.estado == null || this.data.estado == undefined) msgInvalid += '* El campo Tipo de Estado no puede ser vacío<br>';
    if (this.data.estado == 'P') msgInvalid += '* El Tipo de Estado no puede permanecer como Pendiente<br>'
    if (this.data.notificador == 0 || this.data.notificador == undefined) msgInvalid += '* El campo Notificador no puede ser vacío<br>'
    if (this.data.estado == 'R' && (this.data.persona_recepcion == "" || this.data.persona_recepcion == undefined)) msgInvalid += '* El campo Persona que Recibe no puede ser vacío<br>'
    if (this.data.fecha_recepcion == null || this.data.fecha_recepcion == undefined) msgInvalid += '* El campo Fecha de Recepcion no puede ser vacío<br>'
    if (this.data.estado == 'F' && (this.fotos == null || this.fotos.length == 0 || this.fotos == undefined)) msgInvalid += '* No ha adjuntado foto para estado No Fijado.<br>'
    if (this.data.observacion == null || this.data.observacion.trim() == '' || this.data.observacion == undefined) msgInvalid += '* El campo Observacion no puede estar vacío<br>'
    // if (moment(this.data.fecha_recepcion).diff(moment()) > 0) msgInvalid += '* La Fecha de Recepcion no es valida.<br>'

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }

    Object.assign(this.expediente, this.data, {foto: this.fotos[0]?.recurso})
    this.mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    // console.log({ expediente: this.expediente })
    // return
    this.serviceModalDet.setNotificador({expediente: this.expediente}).subscribe(
      (res: any) => {
        // console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire('Expediente actualizado con éxito', '', 'success').then(() => {
          this.modal.close()
          this.commonVarService.modalEditionDetallesCobro.next(res.data)
        }
        )
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error guardando datos de Expediente')
      }
    );
  }

  cargaFoto(archivos) {
    this.mensajeSpinner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos.length) <= 5) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_inspeccion_res_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 5 fotos", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }
}
