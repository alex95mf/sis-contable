import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SueldosService } from '../sueldos.service';
import * as myVarGlobals from 'src/app/global';
import { saturate } from '@amcharts/amcharts4/.internal/core/utils/Colors';
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
  
  sueldos: any = [];
  dataUser: any;
  permissions: any;
  grado: any;
  cargo:  any;
  contrato: any;
  estado: any;
  id_sueldo: any;
  sueldo: any = {
    grupo_ocupacional:0,
    codigo_sectorial:'',
    remuneracion:0.00,
    cargo:0,
    tipo_contrato:0,
    estado:0,
  };
  deshabilitar: boolean = false;
  needRefresh: boolean = false;

  @Input() isNew: any;
  @Input() data: any;
  constructor(    
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiSrv:SueldosService) { }

  ngOnInit(): void {
    this.botonera = [
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
  ]

  this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

  if (!this.isNew) {
    this.botonera = [
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "far fa-save", texto: "EDITAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnSueldo", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
  ]
 
    console.log(this.data);
    this.id_sueldo=this.data['id_sueldo'];
    //this.sueldo = JSON.parse(JSON.stringify(this.data));
    this.sueldo.grupo_ocupacional=this.data['id_ocupacion'];
    this.sueldo.codigo_sectorial=this.data['sld_codigo_sectorial'];
    this.sueldo.remuneracion=this.data['sld_salario_minimo'];
    this.sueldo.cargo=this.data['id_cargo'];
    this.sueldo.tipo_contrato=this.data['id_tipo_contrato'];
    this.sueldo.estado=this.data['estado_id'];
   

    //console.log(' aquiiii '+this.ticketNew);
   // this.deshabilitar = false;
  }else{
    this.sueldo={
      grupo_ocupacional:0,
      codigo_sectorial:'',
      remuneracion:0.00,
      cargo:0,
      tipo_contrato:0,
      estado:0,
    }
  }

  setTimeout(() => {
    this.cargaInicial();
  }, 250)

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
        this.cerrarModal();
        break;
    }
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  validarDatos() {
    /*let invalid = false
    return new Promise((resolve, reject) => {
      if (!this.juicio.fk_contribuyente.razon_social.trim().length) {
        this.toastr.warning('No ha seleccionado un Contribuyente', this.fTitle)
        invalid = true
      } else if (this.juicio.total == 0) {
        this.toastr.warning('No ha ingresado un Total', this.fTitle)
        invalid = true
      } else if (this.cmbEstado ==  undefined   || this.cmbEstado == null ) {
        this.toastr.warning('No ha elegido un Estado', this.fTitle)
        invalid = true
      } 
      else if (this.cmbTipoGestion ==  undefined   || this.cmbTipoGestion == null) {
        this.toastr.warning('No ha elegido un Tipo de Gestión:', this.fTitle)
        invalid = true
      }
      else if (this.juicio.proceso == '') {
        this.toastr.warning('No ha ingresado un Proceso', this.fTitle)
        invalid = true
      } else if (!this.juicio.observaciones.length) {
        this.toastr.warning('No ha ingresado una Observacion', this.fTitle)
        invalid = true
      }
      !invalid ? resolve(!invalid) : reject(invalid)
    })*/
  }
  async validaSueldos() {
    // if (this.isNew && this.permissions.guardar == "0") {
    //   this.toastr.warning("No tiene permisos para crear nuevos Tickets");

    // } else if (!this.isNew && this.permissions.editar == "0") {
    //   this.toastr.warning("No tiene permisos para verTickets.", this.fTitle);
    // } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.saveSueldo();
          } else {
            this.editSueldo();
          }
        }
      });
   // }
  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.sueldo.grupo_ocupacional == 0 ||
        this.sueldo.grupo_ocupacional == undefined
      ) {
        this.toastr.info("Debe seleccionar un Grupo Ocupacional");
        flag = true;
      }
      else if (
        this.sueldo.codigo_sectorial == '' ||
        this.sueldo.codigo_sectorial == undefined
      ) {
        this.toastr.info("El campo Código Sectorial no puede ser vacío");
        flag = true;
      }else if(this.sueldo.codigo_sectorial.length < 13 ){
        this.toastr.info("El campo Código Sectorial debe contener 13 dígitos");
        flag = true;
      }else if(this.sueldo.codigo_sectorial.length > 13 ){
        this.toastr.info("El campo Código Sectorial no puede tener mas de 13 dígitos");
        flag = true;
      } else if (
        this.sueldo.remuneracion == "" ||
        this.sueldo.remuneracion == undefined
      ) {
        this.toastr.info("El campo Remuneración no puede ser vacío");
        flag = true;
      }
      else if (
        this.sueldo.cargo == 0 ||
        this.sueldo.cargo == undefined
      ) {
        this.toastr.info("Debe seleccionar un Cargo");
        flag = true;
      }
      else if (
        this.sueldo.tipo_contrato == 0 ||
        this.sueldo.tipo_contrato == undefined
      ) {
        this.toastr.info("Debe seleccionar un Tipo de Contrato");
        flag = true;
      }
      else if (
        this.sueldo.estado == 0 ||
        this.sueldo.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un Estado");
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

        (this as any).mensajeSpinner = "Guardando Nuevo Sueldo...";
        this.lcargando.ctlSpinner(true);

        let data = {
          sueldo: {
            grupo_ocupacional: this.sueldo.grupo_ocupacional,
            codigo_sectorial: this.sueldo.codigo_sectorial,
            remuneracion: parseFloat(this.sueldo.remuneracion),
            cargo: this.sueldo.cargo,
            tipo_contrato: this.sueldo.tipo_contrato,
            estado: this.sueldo.estado

          }
        }


        this.apiSrv.saveSueldo(data).subscribe(
          (res) => {
            //console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Sueldo Creado con Éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  console.log(res);
                  this.cargarSueldos(res);
                  this.cerrarModal();
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
  editSueldo(){
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

        (this as any).mensajeSpinner = "Editando Sueldo...";
        this.lcargando.ctlSpinner(true);

        let data = {
            id_sueldo:this.id_sueldo,
            grupo_ocupacional: this.sueldo.grupo_ocupacional,
            codigo_sectorial: this.sueldo.codigo_sectorial,
            remuneracion: parseFloat(this.sueldo.remuneracion),
            cargo: this.sueldo.cargo,
            tipo_contrato: this.sueldo.tipo_contrato,
            estado: this.sueldo.estado
        }

        this.apiSrv.updatedSueldo(data).subscribe(
          (res) => {
            //console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Sueldo Editado con Éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  console.log(res);
                  this.cargarSueldos(res);
                  this.cerrarModal();
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

  async cargaInicial() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...'
    this.lcargando.ctlSpinner(true);
    try {
      console.log("daniel")
      // Carga Listado de Grados
      //(this as any).mensajeSpinner = 'Cargando Grados'
      this.grado = await this.apiSrv.getGrupoOcupacional();

      // Lista de Cargos
      //(this as any).mensajeSpinner = 'Cargando Cargos'
      this.cargo = await this.apiSrv.getCargos();
      console.log(this.cargo)
      //this.programas.map((programa: any) => Object.assign(programa, { presupuesto: 0 }))*/
      // Lista de Cargos
     // (this as any).mensajeSpinner = 'Cargando Tipo de Contratos'
      this.contrato = await this.apiSrv.getTipos('TCC');

      //(this as any).mensajeSpinner = 'Cargando Tipo de Contratos'
      this.estado = await this.apiSrv.getTipos('EST');


      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Data Inicial')
    }
  }

  cargarSueldos(dt) {
    this.apiSrv.listaSueldos$.emit(dt)
  }


}
