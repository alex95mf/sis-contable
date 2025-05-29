import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CcSpinerProcesarComponent } from "src/app/config/custom/cc-spiner-procesar.component";
import { CommonVarService } from "src/app/services/common-var.services";
import { PlanCuentasService } from "../plan-cuentas.service";

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalCuentPreComponent } from "../modal-cuent-pre/modal-cuent-pre.component";
/* 
import { GradoOcupacionalService } from '../grado-ocupacional.service'; */
import * as myVarGlobals from "src/app/global";
import Swal from "sweetalert2/dist/sweetalert2.js";
@Component({
standalone: false,
  selector: "app-modal-regla-presupuestaria",
  templateUrl: "./modal-regla-presupuestaria.component.html",
  styleUrls: ["./modal-regla-presupuestaria.component.scss"],
})
export class ModalReglaPresupuestariaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
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
  tipo: any;
  id_sueldo: any;
  sueldo: any = {
    grupo_ocupacional: 0,
    codigo_sectorial: "",
    remuneracion: 0.0,
    cargo: 0,
    tipo_contrato: 0,
    estado: 0,
  };
  onDestroy$: Subject<void> = new Subject();
  deshabilitar: boolean = false;
  needRefresh: boolean = false;
  id_grb_ocupacional: any;
  grb_grupo_ocupacional: any;
  grb_nivel_grado: any;
  grb_rbu_valor: any;
  grb_estado: any;
  estadoList = [
    { valor: "A", descripcion: "ACTIVO" },
    { valor: "I", descripcion: "INACTIVO" },
  ];
  tipoList = [
    { valor: "GENERAL", descripcion: "GENERAL" },
    { valor: "INVERSION", descripcion: "INVERSION" },
  ];
  id_regla_relacion: any;
  cuenta_contable: any;
  codigo_presupuesto_gasto: any;
  codigo_presupuesto_ingreso: any;
  cuenta_contable_cobro: any;
  cuenta_contable_pago: any;
  nombre_cuenta_contable: any;
  isdebe: any;
  ishaber: any;
  @Input() codigo_cuenta: any;
  @Input() nombre_cuenta: any;
  @Input() codigo_presupuesto: any;
  @Input() nombre_presupuesto: any;
  @Input() isNew: any;
  @Input() data: any;
  constructor(
    public modal: NgbActiveModal,
    private modalDet: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiSrv: PlanCuentasService
  ) {
    this.commonVarService.seleciconCategoriaCuentaPro.pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => { //
        
        console.log("cuenta seleccionada",res);
        if (res.validacion == "1") {
          this.cuenta_contable = res.data.codigo + ". " + res.data.nombre;
      //    this.nombre_cuenta_contable =res.data.nombre;
          this.codigo_presupuesto_gasto =
            res.data.presupuesto != null
              ? res.data.codigo_presupuesto + ". " + res.data.presupuesto.nombre
              : res.data.presupuesto_haber != null
                ? res.data.presupuesto_haber.codigo + ". " + res.data.presupuesto_haber.nombre
                : '';
 
          console.log(this.isdebe, this.ishaber);
          if (this.tipo == 'GENERAL') {
            this.isdebe = true;
            this.ishaber = false;
            this.cuenta_contable_cobro = "";
            this.codigo_presupuesto_ingreso = "";
          }
         
        } else if (res.validacion == "2") {
          this.codigo_presupuesto_gasto =
            res.data.codigo + ". " + res.data.nombre;
          
          console.log(this.isdebe, this.ishaber);
          if (this.tipo == 'GENERAL') {
            this.isdebe = true;
          this.ishaber = false;
            this.cuenta_contable_cobro = "";
            this.codigo_presupuesto_ingreso = "";
          }
          /*   this.rubro.cuentaCorrDeb = res.data.codigo
              console.log(res.data);
              this.rubro.numcCorrDeb = res.data.nombre
              this.rubro.cuentaPresupuestoCorrDeb =  res.data.presupuesto != null  ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo
              this.rubro.numpcCorrDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre */
        } else if (res.validacion == "3") {
          this.codigo_presupuesto_ingreso = res.data.codigo + ". " + res.data.nombre;
         
          if (this.tipo == "GENERAL") {
            this.isdebe = false;
            this.ishaber = true;
            this.cuenta_contable_pago = "";
            this.codigo_presupuesto_gasto = "";
          }
        
        } else if (res.validacion == "4") {
          if(!this.isNew){
            this.cuenta_contable_cobro = res.data.codigo + ". " + res.data.nombre;
          }else{
            this.cuenta_contable_cobro = res.data.codigo + " " + res.data.nombre;

          }

        } else if (res.validacion == "5") {
          if(!this.isNew){
            this.cuenta_contable_pago = res.data.codigo + ". " + res.data.nombre;

          }else{
            this.cuenta_contable_pago = res.data.codigo + " " + res.data.nombre;

          }
         
        }
      });
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.initializeButtonArray();
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    // if (!this.isNew) {
    //   this.setupEditDataAndButtonArray();
    // } else {
    //   this.sueldo = {
    //     grupo_ocupacional: 0,
    //     codigo_sectorial: "",
    //     remuneracion: 0.0,
    //     cargo: 0,
    //     tipo_contrato: 0,
    //     estado: 0,
    //   };
    // }

    setTimeout(() => {
      this.findReglaPresupuestaria();
       
      }, 250)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGISTRAR":
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
          this.saveReglaPresupuestaria();
        } else {
          this.editReglaPresupuestaria();
        }
      }
    });
  }


//   borrardatos() {
// console.log("fn")
//     if (this.tipo == 'GENERAL') {
//       if (this.isdebe) {
        
//         this.cuenta_contable_cobro = "";
//         this.codigo_presupuesto_ingreso = "";
//       } else if( this.ishaber){
//         this.cuenta_contable_pago = "";
//         this.codigo_presupuesto_gasto = "";
       
//       }else{
//         this.cuenta_contable_pago = "";
//         this.codigo_presupuesto_gasto = "";
//         this.cuenta_contable_cobro = "";
//         this.codigo_presupuesto_ingreso = "";
//       }
//     }
//   }


  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.estado == 0 || this.estado == undefined || this.estado == "") {
        this.toastr.info("Debe ingresar el estado");
        flag = true;
      } else if (
        this.cuenta_contable == "" ||
        this.cuenta_contable == undefined ||
        this.cuenta_contable == ""
      ) {
        this.toastr.info("El campo cuenta contable no puede ser vacío");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    });
  }

  findReglaPresupuestaria(){

    this.mensajeSpiner = "Buscando regla presupuestaria...";
    this.lcargando.ctlSpinner(true);

    let data = {
      cuenta_contable: this.codigo_cuenta,
    };

    this.apiSrv.findReglaPresupuestaria(data).subscribe(
      (res) => {
        if (res["status"] == 1) {
          this.needRefresh = true;
          this.lcargando.ctlSpinner(false);

          if(res['data']?.id_regla_relacion != undefined){
            console.log('tiene')
            this.isNew = false
            this.id_regla_relacion = res['data'].id_regla_relacion
            this.cuenta_contable = res['data'].cuenta_contable + ". " + res['data'].nombre_cuenta_contable
            this.codigo_presupuesto_gasto = res['data'].codigo_presupuesto_gasto+ ". " +res['data'].nombre_codigo_presupuesto_gasto
            this.cuenta_contable_cobro = res['data'].cuenta_contable_cobro+ ". " +res['data'].nombre_cuenta_contable_cobro
            this.cuenta_contable_pago = res['data'].cuenta_contable_pago+ ". " +res['data'].nombre_cuenta_contable_pago
            this.estado = res['data'].estado
            this.tipo= res['data'].tipo

            this.setupEditDataAndButtonArray()

          }else{
            this.isNew = true
            console.log('no tiene')
            this.cuenta_contable = this.codigo_cuenta + " " + this.nombre_cuenta
            this.codigo_presupuesto_gasto = this.codigo_presupuesto+ " " +this.nombre_presupuesto

          }
       
        } else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res["message"],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#20A8D8",
          });
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    ); 

  }

  saveReglaPresupuestaria() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar esta cuenta complementaria?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#F86C6B",
      confirmButtonColor: "#4DBD74",
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpiner = "Guardando cuentas complementarias...";
        this.lcargando.ctlSpinner(true);

        let data = {
          cuenta_contable: this.cuenta_contable,
          codigo_presupuesto_gasto: this.codigo_presupuesto_gasto,
          codigo_presupuesto_ingreso: this.codigo_presupuesto_ingreso,
          cuenta_contable_cobro: this.cuenta_contable_cobro,
          cuenta_contable_pago: this.cuenta_contable_pago,
          estado: this.estado,
          tipo: 'INVERSION',
          //tipo: this.tipo,
        };

        this.apiSrv.saveReglaPresupuestaria(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cuentas Registradas con Éxito",
                text: res["message"],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8",
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
                text: res["message"],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8",
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        ); /**/
      }
    });
  }

  editReglaPresupuestaria() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar esta cuenta complementaria?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#F86C6B",
      confirmButtonColor: "#4DBD74",
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpiner = "Guardando cuentas complementarias...";
        this.lcargando.ctlSpinner(true);
        let data = {
          id_regla_relacion: this.id_regla_relacion,
          cuenta_contable: this.cuenta_contable,
          codigo_presupuesto_gasto: this.codigo_presupuesto_gasto,
          codigo_presupuesto_ingreso: this.codigo_presupuesto_ingreso,
          cuenta_contable_cobro: this.cuenta_contable_cobro,
          cuenta_contable_pago: this.cuenta_contable_pago,
          estado: this.estado,
          tipo: this.tipo,
        };
        this.apiSrv.updateReglaPresupuestaria(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cuentaa Registradas con Éxito",
                text: res["message"],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8",
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
                text: res["message"],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8",
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
  }

  private initializeButtonArray() {
    this.botonera = [
      {
        orig: "btnSueldo",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "REGISTRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnSueldo",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger btn-sm",
        habilitar: false,
        imprimir: false,
      },
    ];
  }

  private setupEditDataAndButtonArray() {
    this.botonera = [
      {
        orig: "btnSueldo",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnSueldo",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger btn-sm",
        habilitar: false,
        imprimir: false,
      },
    ];

    // this.id_regla_relacion = this.data["id_regla_relacion"];
    // this.cuenta_contable = this.data["cuenta_contable"]/*  + " " + this.data["nombre_cuenta_contable"] */;
    // this.nombre_cuenta_contable = this.data["nombre_cuenta_contable"];
    // this.codigo_presupuesto_gasto = this.data["codigo_presupuesto_gasto"];

    if (
      this.codigo_presupuesto_gasto !== null &&
      this.codigo_presupuesto_gasto !== undefined &&
      this.codigo_presupuesto_gasto !== "" &&
      this.codigo_presupuesto_gasto !== " " &&
      this.codigo_presupuesto_gasto !== ". "
      
    ) {
      this.isdebe = true;
      

    }else{
      this.codigo_presupuesto_gasto = null//this.data["codigo_presupuesto_gasto"] 
    }

    this.codigo_presupuesto_ingreso = this.data["codigo_presupuesto_ingreso"];
    if (
      this.codigo_presupuesto_ingreso !== null &&
      this.codigo_presupuesto_ingreso !== undefined &&
      this.codigo_presupuesto_ingreso !== "" &&
      this.codigo_presupuesto_ingreso !== " " &&
      this.codigo_presupuesto_ingreso !== ". "
    ) {
      this.ishaber = true;
       /* + " " + this.data["nombre_codigo_presupuesto_ingreso"]; */
    }else{
      this.codigo_presupuesto_ingreso = null//this.data["codigo_presupuesto_ingreso"]
    }
    this.cuenta_contable_cobro = this.data["cuenta_contable_cobro"];
    if (
      this.cuenta_contable_cobro !== null &&
      this.cuenta_contable_cobro !== undefined &&
      this.cuenta_contable_cobro !== "" &&
      this.cuenta_contable_cobro !== " " &&
      this.cuenta_contable_cobro !== ". "
    ){
      this.cuenta_contable_cobro = this.data["cuenta_contable_cobro"]/* + " " + this.data["nombre_cuenta_contable_cobro"]; */
    }else{
      this.cuenta_contable_cobro = null
    }
    this.cuenta_contable_pago = this.data["cuenta_contable_pago"];
    if (
      this.cuenta_contable_pago !== null &&
      this.cuenta_contable_pago !== undefined &&
      this.cuenta_contable_pago !== "" &&
      this.cuenta_contable_pago !== " " &&
      this.cuenta_contable_pago !== ". "
    ){

      this.cuenta_contable_pago = this.data["cuenta_contable_pago"]/* + " " + this.data["nombre_cuenta_contable_pago"]; */
    }
    else{
      this.cuenta_contable_pago = null
    }
   
    // this.estado = this.data["estado"];
    // this.tipo = this.data["tipo"];
  }

  modalCuentaContable(valor) {
    let modal = this.modalDet.open(ModalCuentPreComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;
  }




  modalCuentaContableReg(valor) {
    console.log("reglas")
    let modal = this.modalDet.open(ModalCuentPreComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    
    modal.componentInstance.validar = valor;
    console.log("antes llamra")
    if(this.tipo == "GENERAL"){
      modal.componentInstance.tieneReglas = true;
    if (valor == 4) {

      let partes = this.codigo_presupuesto_ingreso.split('.');
      modal.componentInstance.filtrar = partes[0];
    }
    else if (valor == 5) {
      let partes = this.codigo_presupuesto_gasto.split('.');
      modal.componentInstance.filtrar = partes[0];
    }
  }else {
    modal.componentInstance.filtrar = "no filtra";
  }




  }


  modalCodigoPresupuesto(valor) {
    let modal = this.modalDet.open(ModalCuentPreComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = valor;
  }
}
