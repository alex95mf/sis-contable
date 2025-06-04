import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormularioNotificacionesService } from '../formulario-notificaciones.service';
import * as myVarGlobals from 'src/app/global';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';

@Component({
standalone: false,
  selector: 'app-modal-edicion',
  templateUrl: './modal-edicion.component.html',
  styleUrls: ['./modal-edicion.component.scss']
})
export class ModalEdicionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  fTitulo: string = "Recepción de Notificación";
  vmButtons: any;

  validarFecha: boolean = true;
  fileList: FileList;

  @Input() notificacion: any;
  @Input() permissions: any

  data: any = {
    notificador: null,
    persona_recepcion: null,
    fecha_recepcion: null,
    observacion: null
  }

  estados: any[] = [
    { value: 0, label: 'Seleccione un Estado' },
    { value: 'P', label: 'Pendiente' },
    { value: 'R', label: 'Recibido' },
    { value: 'N', label: 'No Recibido' },
    { value: 'G', label: 'Gaceta' },
    { value: 'S', label: 'Sin dirección' },
  ]
  notificadores: any[] = [
    { valor: 0, descripcion: 'Seleccione un Notificador' }
  ]
  validacionDetalles: boolean = false;  // Si hay datos almacenados, poner en solo lectura


  constructor(
    private commonService: CommonService,
    private commVarSrv: CommonVarService,
    private modal: NgbActiveModal,
    private apiService: FormularioNotificacionesService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.commVarSrv.encargadoSelect.asObservable().subscribe(
      (res: any) => {
        // console.log(res)
        this.data.notificador = res.emp_full_nombre
      }
    )
  }

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
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,

      },
    ]

    setTimeout(() => {
      this.validacionDetalles = this.data.fecha_recepcion != null;
      this.fillCatalog()
    }, 50)
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "GUARDAR":
        this.validacion();
        break;
      case "REGRESAR":
        this.modal.close()
        break;
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'TIPO_NOTIFICADOR'",
    };
    console.log(data);
    this.apiService.getCatalogs(data).subscribe(
      (res: any) => {
        console.log(res);
        res.data.TIPO_NOTIFICADOR.forEach((e: any) => {
          const { valor, descripcion } = e
          this.notificadores.push({ valor: valor, descripcion: descripcion })
        })

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  async validacion(){
    console.log()

    await this.validaDataGlobal().then(
      (respuesta)=>{
        if(respuesta){
          this.saveDetalles();
        }
      }
    );
  }

  deshabilitarFecha(event){

    if(event == 'R' || event == 'G'){
      this.validarFecha = false;
    }else {
      this.validarFecha = true;
    }
  }

  validaDataGlobal() {
    // console.log(this.objRegistro);
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.data.estado == 0 ||
        this.data.estado == undefined
      ) {
        this.toastr.info("El campo tipo de estado no puede ser vacío");
        flag = true;
      }
      else if (
        this.data.notificador == 0 ||
        this.data.notificador == undefined
      ) {
        this.toastr.info("El campo notificador no puede ser vacío");
        flag = true;
      } else if (
        this.data.estado == 'R' &&
        (this.data.persona_recepcion == "" ||
        this.data.persona_recepcion == undefined)
      ) {
        this.toastr.info("El campo persona que recibe no puede ser vacío");
        flag = true;
      }
      else if (!this.validarFecha && (
        this.data.fecha_recepcion == 0 ||
        this.data.fecha_recepcion == undefined
      )) {
        this.toastr.info("El campo fecha de recepcion no puede ser vacío");
        flag = true;
      }
      /* else if (
        moment(this.data.fecha_recepcion).diff(moment()) > 0
      ) {
        this.toastr.info("La fecha no puede ser mayor a la de hoy");
        flag = true;
      } */
      else if (
        this.data.observacion == 0 ||
        this.data.observacion == undefined
      ) {
        this.toastr.info("El campo observacion no puede ser vacío");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  saveDetalles() {
    this.mensajeSpinner = "Guardando"
    this.lcargando.ctlSpinner(true)
    Object.assign(this.notificacion, this.data)

    // console.log({notificacion: this.notificacion})
    // return

    if (this.fileList) {
      this.uploadFile()
    }

    this.apiService.setNotificador({notificacion: this.notificacion}).subscribe(
      (res: any) => {
        console.log(res.data)
        this.lcargando.ctlSpinner(false)
        Swal.fire('Notificación actualizada con éxito', '', 'success').then((result)=>{
          this.modal.close()
        }

        )
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error guardando datos de Notificación')
      }
    )
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Notificaciones')
      }, 50)
    }
  }
  uploadFile() {
    let data = {
      module: this.permissions.id_modulo,
      component: myVarGlobals.fCobNotificacion,
      identifier: this.notificacion.id_cob_notificacion,
      id_controlador: myVarGlobals.fCobNotificacion,
      accion: `Nuevo anexo para Juicio ${this.notificacion.id_cob_notificacion}`,
      ip: this.commonService.getIpAddress(),
      description: 'Anexo de Notificacion'
    }

    this.UploadService(this.fileList[0], data);
  }

  UploadService(file: File, payload?: any): void {
    this.apiService.uploadAnexo(file, payload).subscribe(
      res => { },
      err => {
        console.log(err)
        this.toastr.info(err.error.message);
      })
  }

  expandEmpleados() {
    const modal = this.modalService.open(EncargadoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  /* saveDetalles(){
    this.mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.objRegistro['id_cob_notificacion'] = this.idNotificacion;
    this.objRegistro['fk_usuario_registro'] = this.dataUser['id_usuario'];

    console.log(this.objRegistro);
    this.serviceModalDet.updateNotificacionCobro(this.objRegistro).subscribe(
      (res)=>{
        console.log(res);
        this.commSrv.modalEditionDetallesCobro.next({})
        this.lcargando.ctlSpinner(false);
      }
    );

    this.modal.close();
  } */



}
