import { Component, OnInit, ViewChild } from '@angular/core';

import{ FormPlanificacionService } from './form-planificacion.service'

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

@Component({
standalone: false,
  selector: 'app-form-planificacion',
  templateUrl: './form-planificacion.component.html',
  styleUrls: ['./form-planificacion.component.scss']
})
export class FormPlanificacionComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  fTitle = "Ingreso de formulario de Inspección (Planificación)";
  msgSpinner: string = "";
  vmButtons = [];
  dataUser: any;
  permissions: any;

    // Anexos
  fileList: FileList
  fileName: string

  
  fecha = moment(new Date()).format('YYYY-MM-DD HH:mm');

  catalogos: any = {
    tipo_letrero: [],
    via_publica: [],
    tipo_via_publica: [],
    sectores: [],
    tipo_neg: [],
    grupo_neg: []
  };

  inspeccion: any = {
    id_inspeccion_res: "",
    fk_orden: 0,
    fk_local: 0,
    tipo_inspeccion: "PLANIFICACION",
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
      periodo: "",
      uso_suelo: null,
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
  };

  aprueba: any = false;

  formReadOnly: any = true;

  letreros: any = [];
  letrerosEliminar: any = [];
  viaPublica: any = [];

  letrerosBackup:  any = [];
  viaPublicaBackup:  any = [];

  fotos: any = [];
  fotosEliminar: any = [];

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: FormPlanificacionService
  ) {
    this.commonVarService.selectInspeccionPlanificacion.asObservable().subscribe(
      (res) => {
        this.limpiarFormulario();
        console.log(res);
        this.inspeccion = res;
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
          // viaPublica ya se lleno con catalogo por eso se puede recorrer en este foreach
          this.viaPublica.forEach(e => {
            e.id_inspeccion_res_det = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).id_inspeccion_res_det,
            // e.p_vp_tipo = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_tipo,
            e.p_vp_aplica = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_aplica == 0 ? false : true,
            e.p_vp_dimension_1 = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_1,
            e.p_vp_dimension_2 = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_2,
            e.p_vp_dimension = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension,
            e.p_vp_ubicacion = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_ubicacion
          });

          // letreros esta vacio
          this.inspeccion.detalles.forEach(e => {
            if (e.p_rot_codigo != null) {
              let rot = {
                id_inspeccion_res_det: e.id_inspeccion_res_det,
                p_rot_codigo: e.p_rot_codigo,
                p_rot_tipo: e.p_rot_tipo,
                p_rot_longitud: e.p_rot_longitud,
                p_rot_altura: e.p_rot_altura,
                p_rot_area: e.p_rot_area,
                p_rot_cara_1: e.p_rot_cara_1,
                p_rot_cara_2: e.p_rot_cara_2,
                p_rot_factible_1: e.p_rot_factible_1,
                p_rot_factible_2: e.p_rot_factible_2
              }
              console.log(rot);
              this.letreros.push(rot);
            }
          });
        }

        if (this.inspeccion.fotos.length > 0) {
          this.fotos = this.inspeccion.fotos;
        }
      }
    );

    this.commonVarService.editFormInspPlanificacion.asObservable().subscribe(
      (res) => {
        if (res) {
          this.limpiarFormulario();
        }
      }
    );
  }

  ngOnInit(): void {
    this.vmButtons = [
      /*{
        orig: "btnsFormPlanif",
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
        orig: "btnsFormPlanif",
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
        orig: "btnsFormPlanif",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFormPlanif",
        paramAccion: "",
        boton: { icon: "far fa-lock-open-alt", texto: "HABILITAR" },
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
      codigo: myVarGlobals.fRenFormPlanificacion, //////////////////*************** AGREGAR EL CODIGO A VARIABLES GLOBALES
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
      case "GUARDAR":
        this.validarFormulario();
        break;
      case "LIMPIAR":
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
            this.limpiarFormulario();
          }
        });
        break;
      case "HABILITAR":
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
      params: "'TIPO_LETRERO','USO_VIA_PUBLICA','TIPO_USO_VIA_PUBLICA', 'CAT_SECTOR', 'REN_TIPO_NEG', 'REN_GRUPO_NEG'"
    }
    this.apiService.getCatalogos(data).subscribe(
      (res) => {
        this.catalogos.sectores = res['data']['CAT_SECTOR'];
        this.catalogos.tipo_neg = res['data']['REN_TIPO_NEG'];
        this.catalogos.grupo_neg = res['data']['REN_GRUPO_NEG'];
        this.catalogos.tipo_letrero = res['data']['TIPO_LETRERO'];
        this.catalogos.via_publica = res['data']['USO_VIA_PUBLICA'];
        this.catalogos.tipo_via_publica = res['data']['TIPO_USO_VIA_PUBLICA'];
        this.catalogos.via_publica.forEach(e => {
          let op = {
            id_inspeccion_res_det: 0,
            p_vp_codigo: e.descripcion,
            p_vp_tipo: e.valor,
            p_vp_aplica: false,
            p_vp_dimension_1: 0,
            p_vp_dimension_2: 0,
            p_vp_dimension: 0,
            p_vp_ubicacion: "0",
          };
          this.viaPublicaBackup.push(op);
        });
        this.viaPublica = JSON.parse(JSON.stringify(this.viaPublicaBackup));

        ////**** ESTE BLOQUE SE DEBE EJECUTAR LUEGO DE ENCONTRAR LA INSPECCION
        //this.sector = this.catalogos.sectores.find(e => e.id_catalogo == this.inspeccion.local.fk_sector).valor;
        //this.tipo_negocio = this.catalogos.tipo_neg.find(e => e.id_catalogo == this.inspeccion.local.fk_actividad_comercial).valor;
        //this.grupo = this.catalogos.grupo_neg.find(e => e.id_catalogo == this.inspeccion.local.fk_grupo).valor;
        ////**** ESTE BLOQUE SE DEBE EJECUTAR LUEGO DE ENCONTRAR LA INSPECCION


        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(err.error.message, 'Error cargando datos');
      }
    );
  }

  habilitarForm() {
    let id = this.inspeccion.id_inspeccion_res;

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que quieres habilitar el formulario?",
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

  addLetrero() {
    this.letreros.push({
      id_inspeccion_res_det: 0,
      p_rot_codigo: "VA",
      p_rot_tipo: "0",
      p_rot_longitud: 0,
      p_rot_altura: 0,
      p_rot_area: 0,
      p_rot_cara_1: 0,
      p_rot_cara_2: 0,
      p_rot_factible_1: false,
      p_rot_factible_2: false
    });
  }

  limpiarFormulario() {
    this.fileList = undefined;
    this.inspeccion = {
      id_inspeccion_res: "",
      fk_orden: 0,
      fk_local: 0,
      tipo_inspeccion: "PLANIFICACION",
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
        periodo: "",
        uso_suelo: null,
      },
      local_comercial: {
        id_local: 0,
        razon_social: "",
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
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
    this.formReadOnly = true;

    this.fotos = [];
    this.fotosEliminar = [];
    this.letrerosEliminar = [];
    this.commonVarService.limpiarArchivos.next(true);
    this.letreros = JSON.parse(JSON.stringify(this.letrerosBackup));
    this.viaPublica = JSON.parse(JSON.stringify(this.viaPublicaBackup));
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    

  }

  guardarInspeccion() {

        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que quieres guardar la inspección?",
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
              letreros: this.letreros,
              letrerosEliminar: this.letrerosEliminar,
              viaPublica: this.viaPublica,
              fotos: this.fotos.filter(e => e.id_inspeccion_res_fotos === 0),
              fotosEliminar: this.fotosEliminar
            };

            if (this.fileList) {
              this.uploadFile();
            }

            this.apiService.guardarInspeccion(data).subscribe(
              (res) => {
                this.assingFormData(res['data']);
                this.commonVarService.updateFormularioCabPlanificacion.next(res['data']);
                this.lcargando.ctlSpinner(false);
                console.log("Guardando");
                console.log(res);
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

  assingFormData(res) {
    let orden = JSON.parse(JSON.stringify(this.inspeccion.orden_inspeccion));
    let local = JSON.parse(JSON.stringify(this.inspeccion.local_comercial));
    let fotos = JSON.parse(JSON.stringify(this.inspeccion.fotos));
    this.limpiarFormulario();
    console.log(res);
    this.inspeccion = res;
    this.inspeccion["orden_inspeccion"] = orden;
    this.inspeccion["local_comercial"] = local;
    this.fotos = res['fotos'];
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
      // viaPublica ya se lleno con catalogo por eso se puede recorrer en este foreach
      this.viaPublica.forEach(e => {
        e.id_inspeccion_res_det = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).id_inspeccion_res_det,
        // e.p_vp_tipo = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_tipo,
        e.p_vp_aplica = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_aplica == 0 ? false : true,
        e.p_vp_dimension_1 = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_1,
        e.p_vp_dimension_2 = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_2,
        e.p_vp_dimension = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension,
        e.p_vp_ubicacion = this.inspeccion.detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_ubicacion
      });

      // letreros esta vacio
      this.inspeccion.detalles.forEach(e => {
        if (e.p_rot_codigo != null) {
          let rot = {
            id_inspeccion_res_det: e.id_inspeccion_res_det,
            p_rot_codigo: e.p_rot_codigo,
            p_rot_tipo: e.p_rot_tipo,
            p_rot_longitud: e.p_rot_longitud,
            p_rot_altura: e.p_rot_altura,
            p_rot_area: e.p_rot_area,
            p_rot_cara_1: e.p_rot_cara_1,
            p_rot_cara_2: e.p_rot_cara_2,
            p_rot_factible_1: e.p_rot_factible_1,
            p_rot_factible_2: e.p_rot_factible_2
          }
          console.log(rot);
          this.letreros.push(rot);
        }
      });
    }
   
  }

  removeLetrero(index) {
    if (this.letreros[index].id_inspeccion_res_det > 0) {
      this.letrerosEliminar.push(this.letreros.splice(index, 1)[0].id_inspeccion_res_det);
    } else {
      this.letreros.splice(index, 1);
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

  expandirVistaFotos(index) {
    const modalInvoice = this.modalSrv.open(ModalVistaFotosComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
  }
  

  calcAreaL(index) {
    this.letreros[index].p_rot_area = this.letreros[index].p_rot_longitud * this.letreros[index].p_rot_altura;
  }

  calcAreaV(index) {
    this.viaPublica[index].p_vp_dimension = this.viaPublica[index].p_vp_dimension_1 * this.viaPublica[index].p_vp_dimension_2;
  }

  changeAplica(index) {
    if (!this.viaPublica[index].p_vp_aplica) {
      this.viaPublica[index].p_vp_dimension_1 = 0;
      this.viaPublica[index].p_vp_dimension_2 = 0;
      this.viaPublica[index].p_vp_dimension = 0;
      this.viaPublica[index].p_vp_ubicacion = "0";
    }
  }

  expandirInspecciones() {
    const modalInvoice = this.modalSrv.open(ModalInspeccionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
  }

  async validarFormulario() {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para agregar este formulario.");
    } else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar este formulario.", this.fTitle);
    } else {
    let resp = await this.validarCampos().then((respuesta) => {
      if(respuesta) {
        this.guardarInspeccion();
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
        this.toastr.info("Debe seleccionar una fecha de inspeccion");
        flag = true;
      } else if(
        !this.aprueba &&
        (this.inspeccion.fecha_proxima_visita == undefined ||
        this.inspeccion.fecha_proxima_visita == "")
      ) {
        this.toastr.info("En caso que no apruebe debe seleccionar una fecha para la próxima inspeccion");
        flag = true;
      } else if (
        this.inspeccion.observacion == undefined ||
        this.inspeccion.observacion == ""
      ) {
        this.toastr.info("Debe ingresar una observación");
        flag = true;
      } else {
        for(let i=0;i<this.viaPublica.length;i++) {
          if (
            this.viaPublica[i].p_vp_aplica &&
            (this.viaPublica[i].p_vp_ubicacion==0 || this.viaPublica[i].p_vp_ubicacion==undefined)
          ) {
            this.toastr.info("Si aplica alguna vía pública debe ingresar su ubicación, en fila #"+ (i+1) );
            flag = true;
            resolve(false);
            break;          
          } else if(
            this.viaPublica[i].p_vp_aplica &&
            (this.viaPublica[i].p_vp_dimension_1<=0 || this.viaPublica[i].p_vp_dimension_1==undefined)
          ) {
            this.toastr.info("Si aplica alguna vía pública debe ingresar sus dimensiones, en fila #"+ (i+1) );
            flag = true;
            resolve(false);
            break;          
          } else if(
            this.viaPublica[i].p_vp_aplica &&
            (this.viaPublica[i].p_vp_dimension_2<=0 || this.viaPublica[i].p_vp_dimension_2==undefined)
          ) {
            this.toastr.info("Si aplica alguna vía pública debe ingresar sus dimensiones, en fila #"+ (i+1) );
            flag = true;
            resolve(false);
            break;          
          }
        }

        for(let i=0;i<this.letreros.length;i++) {
          if (
            this.letreros[i].p_rot_tipo==0 || this.letreros[i].p_rot_tipo == undefined
          ) {
            this.toastr.info("Debe seleccionar un tipo para letrero #"+ (i+1) );
            flag = true;
            resolve(false);
            break;          
          } else if (
            this.letreros[i].p_rot_longitud<=0 || this.letreros[i].p_rot_longitud == undefined
          ) {
            this.toastr.info("El campo longitud debe ser mayor o igual a 0 en letrero #"+ (i+1) );
            flag = true;
            resolve(false);
            break;
          } else if (
            this.letreros[i].p_rot_altura<=0 || this.letreros[i].p_rot_altura == undefined
          ) {
            this.toastr.info("El campo altura debe ser mayor o igual a 0 en letrero #"+ (i+1) );
            flag = true;
            resolve(false);
            break;
          } 
        }
      }
        !flag ? resolve(true) : resolve(false);
    });
  }

  validarViasPublicas(): boolean {
    var respuesta = false;
    this.viaPublica.forEach(vp => {
      // console.log("entrando");
      if (vp.p_vp_aplica) {
        if (
          vp.p_vp_dimension == 0
        ) {
          this.toastr.info("El area de " + vp.p_vp_tipo + " no debe ser 0");
          respuesta = true;
          return respuesta;
        } else if (
          vp.p_vp_ubicacion == "0"
        ) {
          this.toastr.info("Debes seleccionar una ubicación en el tipo " + vp.p_vp_tipo);
          respuesta = true;
          return respuesta;
        } else {
          console.log("1");
          respuesta = false;
        }
        respuesta = true;
      } else {
        console.log("2");
        respuesta = false;
      }
    });
    console.log(respuesta);
    return respuesta;
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
      module: this.permissions.id_modulo,
      component: myVarGlobals.fRenFormPlanificacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.inspeccion.id_inspeccion_res,
      id_controlador: myVarGlobals.fRenFormPlanificacion,  // TODO: Actualizar cuando formulario ya tenga un ID
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

}
