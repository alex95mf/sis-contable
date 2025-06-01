import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ParametrosNominaService } from '../parametros-nomina.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-parametro-form',
  templateUrl: './parametro-form.component.html',
  styleUrls: ['./parametro-form.component.scss']
})
export class ParametroFormComponent implements OnInit {

  msgSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() isNew: any;
  @Input() data: any;

  vmButtons: any;

  deudora: boolean = false;
  presupuesto: boolean = false;

  parametro = {
    id_parametro: 0,
    codigo: '',
    tipo: 0,
    nombre: '',
    valor:0,
    estado: 0
  }

  listadoNS = []

  tipoRubro = []



  estados = [
    {codigo:'A', label:'Activo' },
    {codigo:'I', label:'Inactivo' }
  ]

  tipos= [
    {valor:'GENERAL', label:'GENERAL' },
    {valor:'OTROS', label:'OTROS' },
  ]

  constructor(
    private modal: NgbActiveModal,
    private service: ParametrosNominaService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
  ) {

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " Guardar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " Actualizar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " Regresar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    setTimeout(() => {

      console.log(this.data)

      if(!this.isNew){
        this.parametro = this.data
        this.vmButtons[0].showimg = false
      }else{

        this.vmButtons[0].showimg = true
        this.vmButtons[1].showimg = false
      }

    }, 50);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " Regresar":
        this.closeModal();
        break;
      case " Guardar":
        this.validacion('SAVE');
        break;
      case " Actualizar":
        this.validacion('UPDATE');
        break;
    }
  }


  closeModal(){
    this.modal.close()
  }



  validacion(valor){
    this.lcargando.ctlSpinner(true)
    if(this.parametro.codigo == undefined || this.parametro.codigo == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Debe ingresar un Código');
    } else if(this.parametro.nombre == undefined || this.parametro.nombre == '' ){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Debe ingresar un Nombre');
    } else{
      if(valor == 'SAVE'){
        this.guardarParametrosNomina();
      }else if(valor == 'UPDATE'){
        this.actualizarParametrosNomina();
      }
    }
  }


  guardarParametrosNomina(){

    this.service.setParametrosNomina(this.parametro).subscribe(
      (res)=>{
        console.log(res)
        if (res["status"] == 1) {

        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Parámetro de nomina guardado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: '#20A8D8',
        }).then((res) => {
          if (res.isConfirmed) {

          }
        })
        this.closeModal();
        this.commonVarSrv.modalCargarRubros.next(null)
        } else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "error",
            title: "Error al guardar parámetro",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }

      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }
  actualizarParametrosNomina(){


    this.service.updateParametrosNomina(this.parametro).subscribe(
      (res)=>{
        console.log(res)
        if (res["status"] == 1) {

        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Parámetro de nomina actualizado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: '#20A8D8',
        }).then((res) => {
          if (res.isConfirmed) {

          }
        })
        this.closeModal();
        this.commonVarSrv.modalParametrosNomina.next(null)

        } else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "error",
            title: "Error al actualizar parámetro",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }

      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }
}
// limpiarCDebe(){
//   if (this.rubro.tipoRubro == 9){


//   console.log("limpiando")
//   this.rubro.cuentaInvDeb ='';
//   this.rubro.numcInvDeb=''; }
// }
//   actualizarRubro(){

//     this.service.updateRubros(this.rubro).subscribe(
//       (res)=>{
//         this.toastr.success('Se Actualizo con éxito');
//         this.lcargando.ctlSpinner(false);
//         this.closeModal();
//         this.commonVarSrv.modalCargarRubros.next(null)
//       }
//     )
//   }

// }
