import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { FormHigieneService } from './form-higiene.service';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { AsignacionComponent } from '../asignacion/asignacion.component';
import { ModalVistaFotosComponent } from '../form-planificacion/modal-vista-fotos/modal-vista-fotos.component';


@Component({
standalone: false,
  selector: 'app-form-higiene',
  templateUrl: './form-higiene.component.html',
  styleUrls: ['./form-higiene.component.scss']
})
export class FormHigieneComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Ingreso de formulario de Inspeccion (Higiene)";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;

  listaInspecciones: any;

  inspeccion_label: string;
  inspeccion: any = {
    id_inspeccion_res: "",
    fk_orden: 0,
    fk_local: 0,
    tipo_inspeccion: "HIGIENE",
    fecha: "",
    fk_inspector: 0,
    observacion: "",
    aprueba: null,
    fecha_proxima_visita: "",
    estado: "",
    orden_inspeccion: {
      id_inspeccion_orden: 0,
      numero_orden: "",
      fecha: "",
      periodo: ""
    },
    local_comercial: {
      id_local: 0,
      razon_social: "",
      tipo_negocio: "",
      fk_sector: {
        id_catalogo: 0,
        tipo: "",
        valor: "",
        descripcion: "",
      },
      fk_actividad_comercial: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      fk_grupo: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      estado: "",
      contrato: "",
      cod_catastral: "",
      uso_suelo: "",
      fk_contribuyente: {
        razon_social: "",
      }
    }
  }
  resultado: any = {
    respuesta: "",
    estado: "",
    cantidad: null
  }

  hayBalanzas: boolean = false;;
  numBalanzas: number = 0;

  today: any;
  tomorrow: any;

  isAdmin: boolean = true;

  letEdit: boolean = false;

  // Anexos
  fileList: FileList
  fileName: string

  listaEstados = [
    {
      value: "B",
      label: "Bueno",
    },
    {
      value: "R",
      label: "Regular",
    },
    {
      value: "M",
      label: "Malo",
    },
  ];

  listaRespuestas = [
    "SI", "NO", "NA"
  ];

  fotos: any = [];
  fotosEliminar: any = [];
  estado: any;

  constructor(
    private modalSrv: NgbModal,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private toastr: ToastrService,
    private formSrv: FormHigieneService
  ) {
    this.commonVarSrv.selectInspeccionHigiene.asObservable().subscribe(
      (res) => {
        if (res) {
          console.log(res);
          this.limpiarForm();
          this.inspeccion = res;
          console.log(this.inspeccion);
          this.inspeccion_label = res.orden_inspeccion.numero_orden;
          this.fotos = this.inspeccion.fotos;
          this.estado = res.estado;
          Object.assign(this.resultado, {
            fecha: res.fecha ? moment(res.fecha).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            observacion: res.observacion,
            aprobado: res.aprueba == 'A',
            plazo_maximo: res.aprueba == 'A' ? moment(res.fecha_proxima_visita).format('YYYY-MM-DD') : moment().add(7, 'days').format('YYYY-MM-DD')
          })
          // this.resultado.fecha = moment(res.fecha).format('YYYY-MM-DD');
          // this.resultado.observacion = res.observacion;
          // this.resultado.aprobado = res.aprueba=="A" ? true : false;
          // this.resultado.plazo_maximo = res.aprueba=="A" ? moment(new Date()).format('YYYY-MM-DD') : moment(res.fecha_proxima_visita).format('YYYY-MM-DD');
          this.resultado.id_inspeccion_res_det = 0; //valor inicial, cambiara si ya ha sido creado antes

          if (res.estado == "C") {
            this.letEdit = false;
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          } else {
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
            this.letEdit = true;
          }

          if (res.detalles.length > 0) { // si existe data en detalle de higiene
            this.resultado.id_inspeccion_res_det = res.detalles[0].id_inspeccion_res_det,
              this.resultado.respuesta = res.detalles[0].h_respuesta;
            this.resultado.estado = res.detalles[0].h_estado;
            this.resultado.cantidad = res.detalles[0].h_cantidad;
          }


        }
      }
    )
  }

  ngOnInit(): void {

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.vmButtons = [
      {
        orig: "btnsFormHigiene",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormHigiene",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormHigiene",
        paramAccion: "",
        boton: { icon: "far fa-lock-open", texto: "HABILITAR" },
        permiso: this.isAdmin,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      // {
      //   orig: "btnsFormHigiene",
      //   paramAccion: "",
      //   boton: { icon: "far fa-lock-open", texto: " SOLICITAR EDICION" },
      //   permiso: !this.isAdmin,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: true,
      // }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.resultado = {
      tipo: "",
      pregunta: "",
      respuesta: 0,
      estado: 0,
      cantidad: 0,
      observacion: "",
      aprobado: false,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      plazo_maximo: moment(new Date()).format('YYYY-MM-DD'),
    }

    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  validaPermisos() {
    this.mensajeSpiner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true)

    let params = {
      // cambiar despues con variable propia
      codigo: myVarGlobals.fRenFormHigiene,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permisos = res["data"][0];
        console.log(this.permisos);
        if (this.permisos.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  cambiarValor(evento) {

    if (!this.resultado.aprobado) {
      this.resultado.plazo_maximo = this.tomorrow;
    } else {
      this.resultado.plazo_maximo = null;
    }
  }

  respChange(event) {

    if (event != "SI") {
      this.resultado.cantidad = 0;
      this.resultado.estado = 0;
    }
  }

  expandirInspecciones() {
    const modalInvoice = this.modalSrv.open(ModalInspeccionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.permisos = this.permisos;
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.guardarForm();
        break;
      case "LIMPIAR":
        this.reiniciarForm();
        break;
      case "HABILITAR":
        this.habilitarForm();
        break;
    }
  }

  validaDataGlobal() {
    return new Promise<void>((resolve, reject) => {
      let message = '';

      // if (moment().diff(moment(this.resultado.fecha)) < 0) {
      //   message += '* Fecha de realización de inspección inválida.\n'
      // }

      if (this.resultado.respuesta == 0 || this.resultado.respuesta == undefined) {
        message += '* Debe especificar si el local posee balanzas.\n'
      }

      if (this.resultado.respuesta == "SI" && (this.resultado.estado == 0 || this.resultado.estado == undefined)) {
        message += '* Debe seleccionar el estado de las balanzas.\n'
      }

      if (this.resultado.respuesta == "SI" && (this.resultado.cantidad <= 0 || this.resultado.cantidad == undefined)) {
        message += '* Debe ingresar la cantidad real de balanzas.\n'
      }

      if (this.resultado.observacion == "" || this.resultado.observacion == undefined) {
        message += '* Debe escribir una observación.\n'
      }

      if (!this.resultado.aprobado && (this.resultado.plazo_maximo == "" || this.resultado.plazo_maximo == undefined)) {
        message += '* Debe escoger una fecha para la proxima visita.\n'
      }

      return (message.length > 0) ? reject(message) : resolve()
    })
  }

  cargaFoto(archivos) {
    this.mensajeSpiner = 'Cargando fotos...';
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

  removeFoto(index) {
    if (this.fotos[index].id_inspeccion_res_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_inspeccion_res_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }

  expandirVistaFotos(index) {
    const modalInvoice = this.modalSrv.open(ModalVistaFotosComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
  }

  guardarForm() {

    if (this.permisos.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
    } else {
      this.validaDataGlobal().then(
        async () => {
          // if (respuesta) {
            const result = await Swal.fire({
              icon: "warning",
              title: "¡Atención!",
              text: "Está seguro de guardar el formulario? Una vez guardado no se podrá editar",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })/* .then(
              (result: any) => { */
                if (result.isConfirmed) {
                  this.mensajeSpiner = "Guardando datos del formulario...";
                  this.lcargando.ctlSpinner(true);

                  let data = {
                    inspeccion: {
                      id_inspeccion_res: this.inspeccion.id_inspeccion_res,
                      tipo_inspeccion: this.inspeccion.tipo_inspeccion,
                      fk_orden: this.inspeccion.fk_orden,
                      estado: this.inspeccion.estado,
                      observacion: this.resultado.observacion,
                      aprueba: this.resultado.aprobado ? "A" : "F",
                      fecha: this.resultado.fecha,
                      fecha_proxima_visita: !this.resultado.aprobado ? this.resultado.plazo_maximo : null,
                    },
                    resultado: {
                      id_inspeccion_res_det: this.resultado.id_inspeccion_res_det,
                      respuesta: this.resultado.respuesta,
                      estado: this.resultado.estado,
                      cantidad: this.resultado.cantidad,
                    },
                    fotos: this.fotos.filter(e => e.id_inspeccion_res_fotos === 0),
                    fotosEliminar: this.fotosEliminar
                  }
                  // console.log(data);

                  if (this.fileList) {
                    this.uploadFile();
                  }


                  this.formSrv.saveResultado(data).subscribe(
                    (res) => {
                      console.log(res);
                      this.lcargando.ctlSpinner(false);
                      // se cierra desde cliente
                      this.assignFormData(res['data']);
                      this.commonVarSrv.updateFormularioCabHig.next(res['data'])
                      this.letEdit = false;
                      this.vmButtons[0].habilitar = true;
                      this.vmButtons[1].habilitar = false;
                      this.vmButtons[2].habilitar = false;
                      this.estado = "C";
                      this.inspeccion.estado = "C";
                      Swal.fire({
                        icon: "success",
                        title: "Formulario guardado en la base de datos",
                        text: res['message'],
                        showCloseButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#20A8D8',
                      });
                    },
                    (error) => {
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                        icon: "error",
                        title: "Error al guardar formulario",
                        text: error.error.message,
                        showCloseButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#20A8D8',
                      });
                    }
                  )
                }
              // }
            // );
          // }
        }
      ).catch(
        (error: string) => {
          this.toastr.warning(error, this.fTitle)
        }
      )
    }
  }

  assignFormData(data) {
    let orden = JSON.parse(JSON.stringify(this.inspeccion.orden_inspeccion));
    let local = JSON.parse(JSON.stringify(this.inspeccion.local_comercial));
    let fotos = JSON.parse(JSON.stringify(this.fotos));
    // this.limpiarForm();
    // this.inspeccion = data;    
    this.inspeccion["orden_inspeccion"] = orden;
    this.inspeccion["local_comercial"] = local;
    // this.inspeccion_label = data.orden_inspeccion.numero_orden;
    this.fotos = fotos;
    this.resultado.fecha = moment(data.fecha).format('YYYY-MM-DD');
    this.estado = data.estado;
    this.resultado.observacion = data.observacion;
    this.resultado.aprobado = data.aprueba == "A" ? true : false;
    this.resultado.plazo_maximo = data.aprueba == "A" ? moment(new Date()).format('YYYY-MM-DD') : moment(data.fecha_proxima_visita).format('YYYY-MM-DD');
    this.resultado.id_inspeccion_res_det = 0; //valor inicial, cambiara si ya ha sido creado antes

    if (data.estado == "C") {
      this.letEdit = false;
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
    } else {
      this.vmButtons[0].habilitar = false;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.letEdit = true;
    }

    if (data.detalles.length > 0) { // si existe data en detalle de higiene
      this.resultado.id_inspeccion_res_det = data.detalles[0].id_inspeccion_res_det,
        this.resultado.respuesta = data.detalles[0].h_respuesta;
      this.resultado.estado = data.detalles[0].h_estado;
      this.resultado.cantidad = data.detalles[0].h_cantidad;
    }

  }

  reiniciarForm() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.limpiarForm();
      }
    });

  }

  limpiarForm() {
    this.inspeccion = {
      id_inspeccion_res: "",
      fk_orden: 0,
      fk_local: 0,
      tipo_inspeccion: "HIGIENE",
      fecha: "",
      fk_inspector: 0,
      observacion: "",
      aprueba: null,
      fecha_proxima_visita: "",
      estado: "",
      orden_inspeccion: {
        id_inspeccion_orden: 0,
        numero_orden: "",
        fecha: "",
        periodo: ""
      },
      local_comercial: {
        id_local: 0,
        razon_social: "",
        tipo_negocio: "",
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: "",
          descripcion: "",
        },
        fk_actividad_comercial: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
        fk_grupo: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
        estado: "",
        contrato: "",
        cod_catastral: "",
        uso_suelo: "",
        fk_contribuyente: {
          razon_social: "",
        }
      }
    }

    this.inspeccion_label = "";

    this.resultado = {
      tipo: "",
      pregunta: "",
      respuesta: 0,
      estado: 0,
      cantidad: 0,
      observacion: "",
      aprobado: false,
      plazo_maximo: moment(new Date()).format('YYYY-MM-DD'),
    }

    this.estado = "";
    this.letEdit = false;
    this.fotos = [];
    this.fotosEliminar = [];
    this.commonVarSrv.limpiarArchivos.next(true);
    this.fileList = undefined;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }

  habilitarForm() {
    let id = this.inspeccion.id_inspeccion_res;

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea habilitar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formSrv.habilitar(id).subscribe(
          (res) => {
            // se abre desde cliente
            this.letEdit = true;
            this.estado = "A";
            this.inspeccion.estado = "A";
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
            Swal.fire({
              icon: "success",
              title: "Formulario habilitado",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al habilitar formulario",
              text: error.error.message,
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        )
      }
    });
  }


  /**
   * Almacena en FileList los archivos a ser enviados al backend
   * @param archivos Archivo seleccionado
   */
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Inspeccion')
      }, 50)
      // console.log(this.fileList)
    }
  }

  /**
   * Se encarga de enviar los archivos al backend para su almacenado
   * @param data Informacion del Formulario de Inspeccion (CAB)
   */
  uploadFile() {
    let data = {
      // Informacion para almacenamiento de anexo y bitacora
      module: this.permisos.id_modulo,
      component: myVarGlobals.fRenFormHigiene,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.inspeccion.id_inspeccion_res,
      id_controlador: myVarGlobals.fRenFormHigiene,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Higiene ${this.inspeccion.id_inspeccion_res}`,
      ip: this.commonSrv.getIpAddress()
    }


    for (let i = 0; i < this.fileList.length; i++) {
      this.UploadService(this.fileList[i], data);
    }

    this.lcargando.ctlSpinner(false)
  }

  /**
   * Envia un archivo al backend
   * @param file Archivo
   * @param payload Metadata
   */
  UploadService(file, payload?: any): void {
    this.formSrv.fileService(file, payload).subscribe(
      res => { },
      err => {
        this.toastr.info(err.error.message, 'Error cargando Anexos');
      })
  }

}
