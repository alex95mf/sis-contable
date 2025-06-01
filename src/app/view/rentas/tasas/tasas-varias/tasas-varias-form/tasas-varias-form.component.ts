import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TasasVariasService } from '../tasas-varias.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-tasas-varias-form',
  templateUrl: './tasas-varias-form.component.html',
  styleUrls: ['./tasas-varias-form.component.scss']
})
export class TasasVariasFormComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
 

  dataUser: any;
  vmButtons: any;
  tasasVarias: any = { tipo_tabla:0, tipo_calculo:0};
  needRefresh: boolean = false;

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() tasas: any;
  

  estadoList = [
    {value: "A",label: "ACTIVO"},
    {value: "I",label: "INACTIVO"}
  ]

  tipoCalculoList = [
    {value: "VA",label: "VALOR"},
    {value: "TA",label: "TABLA"},
    {value: "FA",label: "FACTOR"},
    {value: "IN",label: "INPUT"},
    {value: "AL",label: "ALCABALA"},
    {value: "PL",label: "PLUSVALIA"}
  ]

  //deshabilitar campos
  actions: any = {
    tipoT: false, 
    depD:false,   
    formu:false,  
    valor:false,
    obser:false
  }

  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private tasasVariasSrv: TasasVariasService,
      private commonVarSrv: CommonVarService,
    ) {}

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnTasasVariasForm",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false,
      },
      {
          orig: "btnTasasVariasForm",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.tasasVarias = {
      codigo: "",
      descripcion: "",
      motivacion_legal: "",
      tipo_calculo: 0,
      tipo_tabla: 0,
      depende: "",
      formula: "",
      valor: "",
      estado: "",
      observacion: ""
    }

      if(!this.isNew){
        console.log(this.data);
        this.tasasVarias = JSON.parse(JSON.stringify(this.data));

      if(this.tasasVarias.tipo_calculo == "VA" ){
        this.actions.tipoT = true;
        this.actions.depD = true;
        this.actions.formu = true;
        this.actions.valor = false;
      }else if(this.tasasVarias.tipo_calculo == "FA"){
        this.actions.tipoT = true;
        this.actions.depD = true;
        this.actions.formu = true;
        this.actions.valor = false;
      }else if(this.tasasVarias.tipo_calculo == "TA" ){
        this.actions.tipoT = false;
        this.actions.depD = false;
        this.actions.formu = false;
        this.actions.valor = true;
      }else if(this.tasasVarias.tipo_calculo == "IN"){
        this.actions.tipoT = true;
        this.actions.depD = false;
        this.actions.formu = false;
        this.actions.valor = true;
      }else if(this.tasasVarias.tipo_calculo == "AL" || this.tasasVarias.tipo_calculo == "PL"){
        this.actions.tipoT = true;
        this.actions.depD = false;
        this.actions.formu = false;
        this.actions.valor = true;
      }
    }
           
  }
  editarTasasVarias(dt) {
    this.commonVarSrv.editarTasasVarias.next(dt);
    this.closeModal();
  }
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaTasasVarias();
            break;
  }
}

  disabledTipo(event) {
    if(this.tasasVarias.tipo_calculo == "VA" ){
      this.actions.tipoT = true;
      this.actions.depD = true;
      this.actions.formu = true;
      this.actions.valor = false;
      this.tasasVarias.tipo_tabla = 0;
      this.tasasVarias.depende = undefined;
      this.tasasVarias.formula = undefined;

    }else if(this.tasasVarias.tipo_calculo == "FA"){
      this.actions.tipoT = true;
      this.actions.depD = true;
      this.actions.formu = true;
      this.actions.valor = false;
      this.tasasVarias.tipo_tabla = 0;
      this.tasasVarias.depende = undefined;
      this.tasasVarias.formula = undefined;
    }
    else if(this.tasasVarias.tipo_calculo == "TA" ){
      this.actions.tipoT = false;
      this.actions.depD = false;
      this.actions.formu = false;
      this.actions.valor = true;
      this.tasasVarias.valor = undefined;
    }
    else if(this.tasasVarias.tipo_calculo == "IN"){
      this.actions.tipoT = true;
      this.actions.depD = false;
      this.actions.formu = false;
      this.actions.valor = true;
      this.tasasVarias.tipo_tabla = 0;
      this.tasasVarias.valor = undefined;
      
    }
    else if(this.tasasVarias.tipo_calculo == "AL" || this.tasasVarias.tipo_calculo == "PL"){
      this.actions.tipoT = true;
      this.actions.depD = false;
      this.actions.formu = false;
      this.actions.valor = true;
      this.tasasVarias.tipo_tabla = 0;
      this.tasasVarias.valor = undefined;
    }
    
  }


async validaTasasVarias() {
  if(this.isNew && this.permissions.guardar=="0") {
    this.toastr.warning("No tiene permisos para crear nuevas Tasas");

  } else if (!this.isNew && this.permissions.editar == "0") {
    this.toastr.warning("No tiene permisos para editar Tasas.", this.fTitle);
  } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        
        if(respuesta) {
          if (this.isNew) {
            this.crearTasasVarias();
            
          } else {
            this.editTasasVarias();
          }
        }
      });
  }
}

validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {

    if(
      this.tasasVarias.codigo == "" ||
      this.tasasVarias.codigo == undefined 
    ) {
      this.toastr.info("El campo Código no puede ser vacío");
      flag = true;
    }
    else if (
      this.tasasVarias.descripcion == "" ||
      this.tasasVarias.descripcion == undefined 
    ){
      this.toastr.info("El campo Descripción no puede ser vacío");
      flag = true;
    }else if (
      this.tasasVarias.motivacion_legal == "" ||
      this.tasasVarias.motivacion_legal == undefined 
    ){
      this.toastr.info("El campo Motivación Legal no puede ser vacío");
      flag = true;
    }
    else if (
      this.tasasVarias.tipo_calculo == 0 ||
      this.tasasVarias.tipo_calculo == undefined 
    ){
      this.toastr.info("Debe seleccionar un Tipo de Cálculo");
      flag = true;
    }else if(this.tasasVarias.tipo_calculo == "VA" ){
        if (this.tasasVarias.valor == "" || this.tasasVarias.valor == undefined){
          this.toastr.info("El campo Valor no puede ser vacío");
          flag = true;
        }else if(this.tasasVarias.estado == 0 || this.tasasVarias.estado == undefined){
          this.toastr.info("Debe seleccionar un Estado");
          flag = true;
        }
    }else if(this.tasasVarias.tipo_calculo == "TA" ){
        if (this.tasasVarias.tipo_tabla == "" || this.tasasVarias.tipo_tabla == undefined){
          this.toastr.info("Debe seleccionar un Tipo de tabla");
          flag = true;
        }else if (this.tasasVarias.depende == "" || this.tasasVarias.depende == undefined){
          this.toastr.info("El campo Depende no puede ser vacío");
          flag = true;
        }else if (this.tasasVarias.formula == "" || this.tasasVarias.formula == undefined){
          this.toastr.info("El campo Fórmula no puede ser vacío");
          flag = true;
        }else if(this.tasasVarias.estado == 0 || this.tasasVarias.estado == undefined){
          this.toastr.info("Debe seleccionar un Estado");
          flag = true;
        }
    }else if(this.tasasVarias.tipo_calculo == "FA" ){
        if (this.tasasVarias.valor == "" || this.tasasVarias.valor == undefined){
          this.toastr.info("El campo Valor no puede ser vacío");
          flag = true;
        }else if(this.tasasVarias.estado == 0 || this.tasasVarias.estado == undefined){
          this.toastr.info("Debe seleccionar un Estado");
          flag = true;
        }
    }else if(this.tasasVarias.tipo_calculo == "IN" ){
        if (this.tasasVarias.depende == "" || this.tasasVarias.depende == undefined){
          this.toastr.info("El campo Depende no puede ser vacío");
          flag = true;
        }else if (this.tasasVarias.formula == "" || this.tasasVarias.formula == undefined){
          this.toastr.info("El campo Fórmula no puede ser vacío");
          flag = true;
        }else if(this.tasasVarias.estado == 0 || this.tasasVarias.estado == undefined){
          this.toastr.info("Debe seleccionar un Estado");
          flag = true;
        }
    }
    !flag ? resolve(true) : resolve(false);
  })
}

crearTasasVarias() {
  Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: "¿Seguro que desea crear una nueva tasa?",
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74',
    }).then((result) => {
        if (result.isConfirmed) {
            this.mensajeSppiner = "Guardando tasa...";
            this.lcargando.ctlSpinner(true);

            let data = {
              tasasVarias: {
                codigo: this.tasasVarias.codigo,
                descripcion: this.tasasVarias.descripcion,
                motivacion_legal: this.tasasVarias.motivacion_legal,
                tipo_calculo: this.tasasVarias.tipo_calculo,
                tipo_tabla: this.tasasVarias.tipo_tabla,
                depende: this.tasasVarias.depende,
                formula: this.tasasVarias.formula,
                valor: this.tasasVarias.valor,
                estado: this.tasasVarias.estado,
                observacion: this.tasasVarias.observacion

              }
            }

            this.tasasVariasSrv.createTasasVarias(data).subscribe(
                (res) => {
                    console.log(res);
                    if (res["status"] == 1) {
                    this.needRefresh = true;
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                        icon: "success",
                        title: "Tasa Creada",
                        text: res['message'],
                        showCloseButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#20A8D8',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.closeModal();
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

editTasasVarias() {

  Swal.fire({
    icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea editar esta Tasa?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
  }).then((result) => {
    if (result.isConfirmed) {
        this.mensajeSppiner = "Guardando tasa..."
        this.lcargando.ctlSpinner(true);

        let data = {
          tasasVarias: {
            id_tasas_varias:this.tasasVarias.id_tasas_varias,
            codigo: this.tasasVarias.codigo,
            descripcion: this.tasasVarias.descripcion,
            motivacion_legal: this.tasasVarias.motivacion_legal,
            tipo_calculo: this.tasasVarias.tipo_calculo,
            tipo_tabla: this.tasasVarias.tipo_tabla,
            depende: this.tasasVarias.depende,
            formula: this.tasasVarias.formula,
            valor: this.tasasVarias.valor,
            estado: this.tasasVarias.estado,
            observacion: this.tasasVarias.observacion

          }
        }

        this.tasasVariasSrv.editTasasVarias(this.data.id_tasas_varias, data).subscribe(
            (res) => {
                if (res["status"] == 1) {
                  this.needRefresh = true;
                  this.lcargando.ctlSpinner(false);
                
                Swal.fire({
                    icon: "success",
                    title: "Tasa Actualizada",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.closeModal();
                    this.needRefresh = true;    
                    
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

closeModal() {
  this.commonVarSrv.editarTasasVarias.next(this.needRefresh);
  this.activeModal.dismiss();
}

}
