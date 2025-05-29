import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ConceptosService } from '../../conceptos/conceptos.service';
import { ConceptoDetService } from '../concepto-det.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';

@Component({
standalone: false,
  selector: 'app-concepto-det-form',
  templateUrl: './concepto-det-form.component.html',
  styleUrls: ['./concepto-det-form.component.scss']
})
export class ConceptoDetFormComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;

  datos_usuario: any;

  @Input() modulo: any;
  @Input() esNuevo: any;
  @Input() dato: any;
  @Input() permisos: any;
  @Input() titulo: any;

  searchText: Subject<any> = new Subject<any>()
  searching: any = {
    deudora: false,
    acreedora: false,
    presupuesto: false
  }
  subscription: any
  cuentas: any = {
    deudora: [],
    acreedora: [],
    presupuesto: []
  }

  botonera: any;

  concepto_detalle: any;

  necesita_refrescar: boolean = false;

  lista_conceptos: any;

  descripcion_deudora: any;
  descripcion_acreedora: any;
  descripcion_presupuesto: any;

  lista_estado = [
    {
      estado: "A",
      valor: "Activo"
    },
    {
      estado: "I",
      valor: "Inactivo"
    }
  ];

  tieneExoneracion = [
    {
      value: "S",
      label: "Si"
    },
    {
      value: "N",
      label: "No"
    }
  ]

  constructor(
      public modal: NgbActiveModal,
      private toastr: ToastrService,
      private srvCom: CommonService,
      private srvConceptoDet: ConceptoDetService,
      private srvConcepto: ConceptosService,
      private srvVarCom: CommonVarService,
      private modalDet: NgbModal

  ) {
    this.subscription = this.searchText.pipe(
      debounceTime(1000),
    ).subscribe((param: any) => {
      this.searching[param.field] = true
      this.srvConcepto.getCuentas(param).subscribe(
        (res: any) => {
          // console.log(res.data)
          this.cuentas[param.field] = res.data
          this.searching[param.field] = false
        },
        (err: any) => {
          console.log(err)
          this.searching[param.field] = false
          this.toastr.error(err.error.message, 'Error buscando Cuentas')
        }
      )
    })

    this.srvVarCom.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if( res.validacion == 'Deudora'){
          this.concepto_detalle.cuenta_deudora = res.data.codigo
          this.descripcion_deudora = res.data.descripcion_original
        }else if(res.validacion == 'Acreedora'){
          this.concepto_detalle.cuenta_acreedora = res.data.codigo
          this.descripcion_acreedora = res.data.descripcion_original
        }else if(res.validacion == 'Presupuestario'){
          this.concepto_detalle.codigo_presupuesto = res.data.codigo
          this.descripcion_presupuesto = res.data.descripcion_general
        }
        
      }
    )


  }

  ngOnInit(): void {
    this.botonera = [
      {
          orig: "formBtnConceptoDet",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false
      },
      {
          orig: "formBtnConceptoDet",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false
      }
    ];

    this.datos_usuario = JSON.parse(localStorage.getItem("Datauser"));

    this.concepto_detalle = {
      codigo_detalle: "",
      nombre_detalle: "",
      cuenta_deudora: "",
      cuenta_acreedora: "",
      codigo_presupuesto: "",
      tiene_exoneracion: 0,
      valor: 0,
      estado: "A",
      fk_concepto: 0
    };

    console.log(this.dato)

    setTimeout(() => {
        this.llenarConceptos();
        if(!this.esNuevo) {
          this.concepto_detalle = {
            codigo_detalle: this.dato.codigo_detalle,
            nombre_detalle: this.dato.nombre_detalle,
            cuenta_deudora: this.dato.cuenta_deudora,
            cuenta_acreedora: this.dato.cuenta_acreedora,
            codigo_presupuesto: this.dato.codigo_presupuesto,
            tiene_exoneracion: this.dato.tiene_exoneracion,
            valor: this.dato.valor,
            estado: this.dato.estado,
            fk_concepto: this.dato.fk_concepto
          };
          this.descripcion_deudora = this.dato.cuenta_deudora_codigo.nombre
          this.descripcion_acreedora =  this.dato.cuenta_acreedora_codigo.nombre
          this.descripcion_presupuesto =  this.dato.codigo_presupuesto_codigo.descripcion_general
        }
    }, 0);
  }

  llenarConceptos() {
    this.texto_barra_carga = "Cargando conceptos...";
    this.barra_carga.ctlSpinner(true);

    this.srvConcepto.getConceptos().subscribe(
      (res) => {
        this.lista_conceptos = res['data'];
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  lookup(event: any, field: string) {
    if (event.target.value.length > 3 && event.target.value.length < 13) this.searchText.next({term: event.target.value, field: field})
  }

  crearConceptoDet() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo detalle de concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {
        this.texto_barra_carga = "Guardando detalle de concepto...";
        this.barra_carga.ctlSpinner(true);

        let dato = {
          concepto: {
            id: this.concepto_detalle.fk_concepto,
            concepto_det: {
              codigo_detalle: this.concepto_detalle.codigo_detalle,
              nombre_detalle: this.concepto_detalle.nombre_detalle,
              cuenta_deudora: this.concepto_detalle.cuenta_deudora,
              cuenta_acreedora: this.concepto_detalle.cuenta_acreedora,
              codigo_presupuesto: this.concepto_detalle.codigo_presupuesto,
              tiene_exoneracion: this.concepto_detalle.tiene_exoneracion,
              valor: this.concepto_detalle.valor,
              tiene_tarifa: null,
              estado: this.concepto_detalle.estado
            }
          }
        }

        this.srvConceptoDet.crearConceptoDet(dato).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.necesita_refrescar = true;
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Detalle de Concepto Creado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.cerrarModal();
                }
              });
            } else {
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
          },
          (error) => {
            this.barra_carga.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  editarConceptoDet() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Detalle de Concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {
        this.texto_barra_carga = "Guardando detalle de concepto..."
        this.barra_carga.ctlSpinner(true);

        let dato = {
          concepto: {
            id: this.concepto_detalle.fk_concepto,
            concepto_det: {
              codigo_detalle: this.concepto_detalle.codigo_detalle,
              nombre_detalle: this.concepto_detalle.nombre_detalle,
              cuenta_deudora: this.concepto_detalle.cuenta_deudora,
              cuenta_acreedora: this.concepto_detalle.cuenta_acreedora,
              codigo_presupuesto: this.concepto_detalle.codigo_presupuesto,
              tiene_exoneracion: this.concepto_detalle.tiene_exoneracion,
              valor: this.concepto_detalle.valor,
              tiene_tarifa: null,
              estado: this.concepto_detalle.estado
            }
          }
        }
        this.srvConceptoDet.actualizarConceptoDet(this.dato.id_concepto_detalle, dato).subscribe(
          (res) => {
            if (res["status"] == 1) {
            this.necesita_refrescar = true;
            this.barra_carga.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Concepto Detalle Actualizado",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result) => {
              if (result.isConfirmed) {
                this.cerrarModal();
              }
            });
            } else {
            this.barra_carga.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            });
            }
          },
          (error) => {
            this.barra_carga.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
  }

  obtenerConceptoDetId(id) {
    this.texto_barra_carga = "Obteniendo conceptos...";
    this.barra_carga.ctlSpinner(true);
    this.srvConceptoDet.obtenerConceptoDetId(id).subscribe(
      (res) => {
        this.concepto_detalle = res['data'];
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.cerrarModal();
        break;

      case " GUARDAR":
        this.validaConcepto();
        break;
    }
  }

  cerrarModal() {
    this.srvVarCom.editConceptoDet.next(this.necesita_refrescar);
    this.modal.dismiss();
  }

  async validaConcepto() {
    if(this.esNuevo && this.permisos.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos Detalle");
  
    } else if (!this.esNuevo && this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.titulo);
    } else {
      let resp = await this.validarDatosConcepto().then((respuesta) => {
        if(respuesta) {
          if (this.esNuevo) {
            this.crearConceptoDet();
          } else {
            this.editarConceptoDet();
          }
        }
      });
    }
  }

  validarDatosConcepto() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.concepto_detalle.codigo_detalle == "" ||
        this.concepto_detalle.codigo_detalle == undefined 
      ) {
        this.toastr.info("El campo Código no puede ser vacío");
        flag = true;
      } else if(
        this.concepto_detalle.codigo_detalle.length > 10
      ) {
        this.toastr.info("El campo Código no puede tener una longitud mayor a 10");
        flag = true;
      } else if(
        this.concepto_detalle.nombre_detalle == "" ||
        this.concepto_detalle.nombre_detalle == undefined
      ) {
        this.toastr.info("El campo Nombre no puede ser vacío");
        flag = true;
      } else if (
        this.concepto_detalle.cuenta_deudora == "" ||
        this.concepto_detalle.cuenta_deudora == undefined
      ) {
        this.toastr.info("El campo Cuenta Deudora no puede ser vacío");
        flag = true;
      } else if(
        this.concepto_detalle.cuenta_deudora.length > 20
      ) {
        this.toastr.info("El campo Cuenta Deudora no puede tener una longitud mayor a 20");
        flag = true;
      } else if (
        this.concepto_detalle.cuenta_acreedora == "" ||
        this.concepto_detalle.cuenta_acreedora == undefined
      ) {
        this.toastr.info("El campo Cuenta Acreedora no puede ser vacío");
        flag = true;
      } else if(
        this.concepto_detalle.cuenta_deudora.length > 20
      ) {
        this.toastr.info("El campo Cuenta Acreedora no puede tener una longitud mayor a 20");
        flag = true;
      } else if (
        this.concepto_detalle.codigo_presupuesto == "" ||
        this.concepto_detalle.codigo_presupuesto == undefined
      ) {
        this.toastr.info("El campo Código Presupuesto no puede ser vacío");
        flag = true;
      } else if(
        this.concepto_detalle.cuenta_deudora.length > 20
      ) {
        this.toastr.info("El campo Código Presupuesto no puede tener una longitud mayor a 20");
        flag = true;
      } else if (
        this.concepto_detalle.tiene_exoneracion == 0 ||
        this.concepto_detalle.tiene_exoneracion == undefined
      ) {
        this.toastr.info("Debe indicar si aplica exoneración o no");
        flag = true;
      } else if (
        this.concepto_detalle.estado == 0 ||
        this.concepto_detalle.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un Estado");
        flag = true;
      } else if (
        this.concepto_detalle.fk_concepto == 0 ||
        this.concepto_detalle.fk_concepto == undefined
      ) {
        this.toastr.info("Debe seleccionar un Concepto");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    });
  }



  modalCodigoPresupuesto(){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = 'Presupuestario';
  }

  modalCuentaContable(valor){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;
    
  }



}
