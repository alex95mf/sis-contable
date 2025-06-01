import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { GradoOcupacionalService } from '../grado-ocupacional.service';
import * as myVarGlobals from 'src/app/global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
standalone: false,
  selector: 'app-sueldo-nuevo',
  templateUrl: './sueldo-nuevo.component.html',
  styleUrls: ['./sueldo-nuevo.component.scss']
})
export class SueldoNuevoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  botonera: any = [];
  fTitle = "Nuevo Sueldo";
  mensajeSpiner: string = "Cargando...";
  sueldos: any = [];
  dataUser: any;
  permissions: any;
  grado: any;
  cargo: any;
  contrato: any;
  estado: any;
  id_sueldo: any;
  sueldo: any = {
    grupo_ocupacional: 0,
    codigo_sectorial: '',
    remuneracion: 0.00,
    cargo: 0,
    tipo_contrato: 0,
    estado: 0,
  };
  deshabilitar: boolean = false;
  needRefresh: boolean = false;
  id_grb_ocupacional: any;
  grb_grupo_ocupacional: any;
  grb_nivel_grado: any;
  grb_rbu_valor: any;
  grb_estado: any;
  estadoList = [
    { valor: 'A', descripcion: 'Activo' },
    { valor: 'I', descripcion: 'Inactivo' },
  ]


  @Input() isNew: any;
  @Input() data: any;
  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiSrv: GradoOcupacionalService) { }

  ngOnInit(): void {

    this.initializeButtonArray();
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    if (!this.isNew) {
     this.setupEditDataAndButtonArray()
    } else {
      this.sueldo = {
        grupo_ocupacional: 0,
        codigo_sectorial: '',
        remuneracion: 0.00,
        cargo: 0,
        tipo_contrato: 0,
        estado: 0,
      }
    }


  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validaSueldos();
        break;
      case "EDITAR":
        this.validaSueldos();
        break;
      case "REGRESAR":
        this.cerrarModal("noctualizar");
        break;
    }
  }

  cerrarModal(x) {
    this.modal.dismiss(x);
  }


  async validaSueldos() {

    let resp = await this.validaDataGlobal().then((respuesta) => {

      if (respuesta) {
        if (this.isNew) {
          this.saveSueldo();
        } else {
          this.editSueldo();
        }
      }
    });}

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.grb_grupo_ocupacional == 0 ||
        this.grb_grupo_ocupacional == undefined
      ) {
        this.toastr.info("Debe ingresar nombre al Grupo Ocupacional");
        flag = true;
      }
      else if (
        this.grb_nivel_grado == '' ||
        this.grb_nivel_grado == undefined
      ) {
        this.toastr.info("El campo nivel grado no puede ser vacío");
        flag = true;
      } else if (
        this.grb_rbu_valor == "" ||
        this.grb_rbu_valor == undefined
      ) {
        this.toastr.info("El campo Valor no puede ser vacío");
        flag = true;
      }
      else if (
        this.grb_estado == 0 ||
        this.grb_estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      }



      !flag ? resolve(true) : resolve(false);
    })
  }

  saveSueldo() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un Nuevo Sueldo?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpiner = "Guardando Nuevo Sueldo...";
        this.lcargando.ctlSpinner(true);

        let data = {

          grb_grupo_ocupacional: this.grb_grupo_ocupacional,
          grb_nivel_grado: this.grb_nivel_grado,
          grb_rbu_valor: parseFloat(this.grb_rbu_valor),
          grb_estado: this.grb_estado
        }


        this.apiSrv.saveSueldo(data).subscribe(
          (res) => {

            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Grado Ocupacional Creado con Éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  console.log(res);
                  this.cerrarModal("actualizar");
                }
              });
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    });
  }
  
  editSueldo() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este sueldo?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpiner = "Editando Sueldo...";
        this.lcargando.ctlSpinner(true);
        let data = {
          id_grb_ocupacional: this.id_grb_ocupacional,
          grb_grupo_ocupacional: this.grb_grupo_ocupacional,
          grb_nivel_grado: this.grb_nivel_grado,
          grb_rbu_valor: parseFloat(this.grb_rbu_valor),
          grb_estado: this.grb_estado
        }
        this.apiSrv.updateSueldo(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Grado Ocupacional Editado con Éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  this.cerrarModal("actualizar");
                }
              });
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    });
  }



  private initializeButtonArray() {
    this.botonera = [
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ]
  }


  private setupEditDataAndButtonArray() {
    this.botonera = [
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "far fa-save", texto: "EDITAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ]



    this.id_grb_ocupacional = this.data['id_grb_ocupacional']
    this.grb_grupo_ocupacional = this.data['grb_grupo_ocupacional'];
    this.grb_nivel_grado = this.data['grb_nivel_grado'];
    this.grb_rbu_valor = this.data['grb_rbu_valor'];
    this.grb_estado = this.data['estado'];
  }

  
}
