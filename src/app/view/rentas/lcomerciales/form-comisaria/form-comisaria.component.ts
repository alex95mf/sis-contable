import { Component, OnInit, ViewChild } from '@angular/core';

import { FormComisariaService } from './form-comisaria.service'

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { ModalVehiculosComponent } from './modal-vehiculos/modal-vehiculos.component';

@Component({
standalone: false,
  selector: 'app-form-comisaria',
  templateUrl: './form-comisaria.component.html',
  styleUrls: ['./form-comisaria.component.scss']
})
export class FormComisariaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = "Ingreso de formulario de Inspección (Comisaría)";
  msgSpinner: string = "";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  fecha = moment(new Date()).format('YYYY-MM-DD HH:mm');

  // Anexos
  fileList: FileList
  fileName: string

  catalogos: any = {
    preguntas: [],
    sectores: [],
    tipo_neg: [],
    grupo_neg: []
  };

  inspeccion: any = {
    id_inspeccion_res: "",
    fk_orden: 0,
    fk_local: 0,
    tipo_inspeccion: "COMISARIA",
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
    c_esintroductor: "",
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
  };

  aprueba: any = false;

  formReadOnly: any = true;
  disableVehiculos: any = true;

  formulario: any = [];
  formularioBackup: any = [];

  fotos: any = [];
  fotosEliminar: any = [];

  listaVehiculos: any = [];
  numVehiculos: number = 0;

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: FormComisariaService
  ) {
    this.commonVarService.selectInspeccionComisaria.asObservable().subscribe(
      (res) => {
        this.limpiarForm();
        console.log(res);
        this.inspeccion = res;
        if(this.inspeccion.c_esintroductor == 'SI') {
          this.disableVehiculos = false;
        } else {
          this.disableVehiculos = true;
        }
        this.inspeccion.fecha = this.inspeccion.fecha ? this.inspeccion.fecha.split(" ")[0] : "";
        this.inspeccion.fecha_proxima_visita = this.inspeccion.fecha_proxima_visita ? this.inspeccion.fecha_proxima_visita.split(" ")[0] : "";
        this.inspeccion.orden_inspeccion.fecha = this.inspeccion.orden_inspeccion.fecha ? this.inspeccion.orden_inspeccion.fecha.split(" ")[0] : "";
        this.aprueba = this.inspeccion.aprueba=='A' ? true : false;

        if (this.inspeccion.estado == "C") {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[2].habilitar = false;
          this.formReadOnly = true;
        } else {
          this.vmButtons[0].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.formReadOnly = false;
        }
        this.vmButtons[1].habilitar = false;
        if (this.inspeccion.detalles.length > 0) {
          this.formulario.forEach(e => {
            e.id_inspeccion_res_det = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).id_inspeccion_res_det,
            e.c_respuesta = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_respuesta,
            e.c_dias = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_dias,
            e.c_anio = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_anio,
            e.c_placa = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_placa,
            e.c_tonelaje = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_tonelaje,
            e.c_observacion = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_observacion
          });
        }
        if (this.inspeccion.fotos.length > 0) {
          this.fotos = this.inspeccion.fotos;
        }

        // get vehiculos para saber si se puede desactivar introductor

        this.msgSpinner = "Cargando vehiculos por inspeccion...";
        // this.lcargando.ctlSpinner(true);
        this.apiService.getVehiculosByInspeccion({id_inspeccion_res_cab: this.inspeccion.id_inspeccion_res}).subscribe(
          (res) => {
            // console.log(res);
            this.listaVehiculos = res['data'];
            this.numVehiculos = this.listaVehiculos.length;

            this.lcargando.ctlSpinner(false);
          },
          (err) => {
            console.log(err);
            this.lcargando.ctlSpinner(false);
            this.toastr.error(err.error.message, 'Error al intentar cargar vehiculos');
          }
        )

      }
    )

    this.commonVarService.numVehiculos.asObservable().subscribe(
      (res) => {
        // calcular num vehiculos despues de que se agreguen o eliminen vehiculos
        this.numVehiculos = res;
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      /*{
        orig: "btnsFormComis",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " SELECCIONAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },*/
      {
        orig: "btnsFormComis",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormComis",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormComis",
        paramAccion: "",
        boton: { icon: "far fa-lock-open-alt", texto: " HABILITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
    ]

    setTimeout(() => {
      this.validaPermisos();
    }, 0);
  }

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRenFormComisaria, //////////////////*************** AGREGAR EL CODIGO A VARIABLES GLOBALES
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          this.getCatalogos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      /*case " SELECCIONAR":

        break;*/
      case " GUARDAR":
        // Junto al metodo de Guardar, llamar a UploadFile.
        // Una vez se tenga la confirmacion del almacenamiento, llamar a this.commonVarService.updateFormularioCabCom.next(null) con el objeto res_cab
        // (o un objeto con propiedad id_inspeccion_res que deberia ser el ID de la cabecera)
        this.validarFormulario();
        break;
      case " LIMPIAR":
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que quieres limpiar los datos de la inspección?",
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
        break;
      case " HABILITAR":
        this.habilitarForm();
        break;
      default:
        break;
    }
  }

  getCatalogos() {
    this.msgSpinner = 'Obteniendo Recursos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'FORM_INSPEC_COMISARIA', 'CAT_SECTOR', 'REN_TIPO_NEG', 'REN_GRUPO_NEG'"
    }
    this.apiService.getCatalogos(data).subscribe(
      (res) => {
        this.catalogos.sectores = res['data']['CAT_SECTOR'];
        this.catalogos.tipo_neg = res['data']['REN_TIPO_NEG'];
        this.catalogos.grupo_neg = res['data']['REN_GRUPO_NEG'];
        this.catalogos.preguntas = res['data']['FORM_INSPEC_COMISARIA'];
        this.catalogos.preguntas.forEach(e => {
          let preg = {
            id_inspeccion_res_det: 0,
            c_num: e.descripcion,
            c_pregunta: e.valor,
            c_respuesta: false,
            c_dias: null,
            c_anio: null,
            c_placa: null,
            c_tonelaje: null,
            c_observacion: ""
          }
          this.formularioBackup.push(preg);
        });
        this.formulario = JSON.parse(JSON.stringify(this.formularioBackup));
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando datos');
      }
    );
  }

  limpiarForm() {

    this.fileList = undefined
    this.inspeccion = {
      id_inspeccion_res: 0,
      fk_orden: 0,
      fk_local: 0,
      tipo_inspeccion: "COMISARIA",
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
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: "",
          descripcion: ""
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
    };

    this.aprueba = false;

    this.fotos = [];
    this.fotosEliminar = [];
    this.commonVarService.limpiarArchivos.next(true);
    this.formReadOnly = true;
    this.disableVehiculos = true;
    this.formulario = JSON.parse(JSON.stringify(this.formularioBackup));
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }

  async validarFormulario() {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para agregar este formulario.");
    } else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar este formulario.", this.fTitle);
    } else {
    let resp = await this.validarCampos().then((respuesta) => {
      if(respuesta) {
        this.actualizarInspeccion();
        }
      });
    }
  }

  validarCampos() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.inspeccion.fecha == undefined ||
        this.inspeccion.fecha == ""
      ) {
        this.toastr.info("Debe seleccionar una fecha de inspección");
        flag = true;
      } else if(
        !this.aprueba &&
        (this.inspeccion.fecha_proxima_visita == undefined ||
        this.inspeccion.fecha_proxima_visita == "")
      ) {
        this.toastr.info("En caso que no apruebe debe seleccionar una fecha para la próxima inspección");
        flag = true;
      } else if (
        this.inspeccion.observacion == undefined ||
        this.inspeccion.observacion == ""
      ) {
        this.toastr.info("Debe ingresar una observación");
        flag = true;
      } else {

        for(let i=0;i<this.formulario.length;i++) {
          if (
            !this.formulario[i].c_respuesta && ((this.formulario[i].c_dias<=0 || this.formulario[i].c_dias==undefined)
            || (this.formulario[i].c_observacion=="" || this.formulario[i].c_observacion == undefined))
          ) {
            this.toastr.info("Si no aprueba debe ingresar días y observación, en fila #"+ (i+1) );
            flag = true;
            resolve(false);
            break;
          } else if (i==3 && (this.formulario[i].c_respuesta && (
            this.formulario[i].c_anio==undefined || this.formulario[i].c_anio==null || this.formulario[i].c_anio==0
          ))) {
            this.toastr.info("Debe ingresar un año válido en caso que aplique permiso de funcionamiento de bomberos");
            flag = true;
            resolve(false);
          }
        }
      }
        !flag ? resolve(true) : resolve(false);
    });
  }

  actualizarInspeccion() {

        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea guardar la inspección?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            this.msgSpinner = 'Guardando datos de la Inspección...';
            this.lcargando.ctlSpinner(true);
            this.inspeccion.aprueba = this.aprueba ? "A" : "F";
            let data = {
              inspeccion: this.inspeccion,
              formulario: this.formulario,
              fotos: this.fotos.filter(e => e.id_inspeccion_res_fotos === 0),
              fotosEliminar: this.fotosEliminar
            }
            if (this.fileList) {
              this.uploadFile();
            }
            console.log(data);
            this.apiService.updateInspeccion(data).subscribe(
              (res) => {
                this.assingFormData(res['data']);
                console.log(res);
                this.commonVarService.updateFormularioCab.next(res['data'])
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Inspección Guardada",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              },
              (err) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.error(err.error.message, 'Error guardando Inspección');
                console.error(err);
              }
            );
          }
        });
  }



  assingFormData(data) {
    let orden = JSON.parse(JSON.stringify(this.inspeccion.orden_inspeccion));
    let local = JSON.parse(JSON.stringify(this.inspeccion.local_comercial));
    let fotos = JSON.parse(JSON.stringify(this.fotos));
    this.limpiarForm();
    this.inspeccion = data;
    this.inspeccion["orden_inspeccion"] = orden;
    this.inspeccion["local_comercial"] = local;
    this.fotos = fotos;
    this.inspeccion.fecha = this.inspeccion.fecha ? this.inspeccion.fecha.split(" ")[0] : "";
    this.inspeccion.fecha_proxima_visita = this.inspeccion.fecha_proxima_visita ? this.inspeccion.fecha_proxima_visita.split(" ")[0] : "";
    this.inspeccion.orden_inspeccion.fecha = this.inspeccion.orden_inspeccion.fecha ? this.inspeccion.orden_inspeccion.fecha.split(" ")[0] : "";
    this.aprueba = this.inspeccion.aprueba=='A' ? true : false;

    if(this.inspeccion.c_esintroductor == 'SI') {
      this.disableVehiculos = false;
    } else {
      this.disableVehiculos = true;
    }

    if (this.inspeccion.estado == "C") {
      this.vmButtons[0].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.formReadOnly = true;
    } else {
      this.vmButtons[0].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.formReadOnly = false;
    }
    this.vmButtons[1].habilitar = false;
    if (this.inspeccion.detalles.length > 0) {
      this.formulario.forEach(e => {
        e.id_inspeccion_res_det = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).id_inspeccion_res_det,
        e.c_respuesta = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_respuesta,
        e.c_dias = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_dias,
        e.c_anio = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_anio,
        e.c_placa = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_placa,
        e.c_tonelaje = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_tonelaje,
        e.c_observacion = this.inspeccion.detalles.find(p => e.c_num == p.c_pregunta).c_observacion
      });
    }
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
        this.msgSpinner = 'Habilitando formulario...';
        this.lcargando.ctlSpinner(true);
        this.apiService.habilitar(id).subscribe(
          (res)=>{
            // se abre desde cliente
            this.formReadOnly = false;
            this.inspeccion.estado = "A";
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
            this.lcargando.ctlSpinner(false);
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

  changePregunta(index) {
    if (this.formulario[index].c_respuesta) {
      this.formulario[index].c_dias = null;
    }

  }

  handleCheck(fila) {
    if (fila.c_num == "02" && fila.c_respuesta) {
      // console.log(fila);
      if(this.numVehiculos>0) {
        this.toastr.warning("No es posible quitar este campo si tiene vehiculos registrados", 'Atención');
        return false;
      }

    } else {
      return true;
    }
  }

  cargaFoto(archivos) {
    this.msgSpinner = 'Cargando fotos...';
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

  expandirInspecciones() {
    const modalInvoice = this.modalSrv.open(ModalInspeccionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
  }

  expandirVistaFotos(index) {
    const modalInvoice = this.modalSrv.open(ModalVistaFotosComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
  }

  /**
   * Almacena en FileList los archivos a ser enviados al backend
   * @param archivos Archivo seleccionado
   */
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Inspección')
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
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.inspeccion.id_inspeccion_res,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.inspeccion.id_inspeccion_res}`,
      ip: this.commonService.getIpAddress()
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
    this.apiService.fileService(file, payload).subscribe(
      res => { },
      err => {
        this.toastr.info(err.error.message, 'Error cargando Anexos');
      })
  }

  registraVehiculos(inspeccion: any) {
    const modal = this.modalSrv.open(ModalVehiculosComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.inspeccion = inspeccion;
    modal.componentInstance.permisos = this.permissions;
    modal.componentInstance.formDisabled = false;
  }
}
