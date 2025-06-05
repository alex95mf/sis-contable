import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { PuestoMercadoService } from '../puesto-mercado.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-puesto-mercado-form',
  templateUrl: './puesto-mercado-form.component.html',
  styleUrls: ['./puesto-mercado-form.component.scss']
})
export class PuestoMercadoFormComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })  lcargando: CcSpinerProcesarComponent;
  

  dataUser: any;

  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() mercados: any;

  vmButtons: any;

  puesto: any;

  estados = [
    {
      value: 'D',
      descripcion: 'Disponible',
    },
    {
      value: 'A',
      descripcion: 'Alquilado',
    },
    {
      value: 'I',
      descripcion: 'Inactivo',
    }
  ]

  needRefresh: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private puestoSrv: PuestoMercadoService,
    private commonVarSrv: CommonVarService,
    public validaciones: ValidacionesFactory,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnPuestoMercadoForm",
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
          orig: "btnPuestoMercadoForm",
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

  this.puesto = {
    id_mercado_puesto: null,
    numero_puesto: "",
    fk_mercado: 0,
    descripcion: "",
    ubicacion: "",
    estado: 0
  }

  setTimeout(() => {
    
    if(!this.isNew) {
      (this as any).mensajeSpinner = "Cargando data";
      this.lcargando.ctlSpinner(true);

      this.puesto = this.data;
      this.lcargando.ctlSpinner(false);
    }

  }, 0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.activeModal.close();
            break;
        case " GUARDAR":
            this.validaPuestoMercado();
            break;
    }
  }

  async validaPuestoMercado() {
    if(this.permissions.guardar=="0"){
      this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
    } else {
      let resp = await this.validaDataPMercado().then((respuesta)=>{
        if (respuesta) {
          if (this.isNew) {
            this.crearPuestoMercado();
          } else {
            this.editPuestoMercado();
          }
        }
      })
    }
  }

  validaDataPMercado() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.puesto.numero_puesto=="" ||
        this.puesto.numero_puesto==undefined
      ) {
        this.toastr.info("Debe ingresar un número de puesto");
        flag = true;
      } else if(
        this.puesto.fk_mercado==0 ||
        this.puesto.fk_mercado==undefined
      ) {
        this.toastr.info("Debe seleccionar un mercado de la lista desplegable");
        flag = true;
      } else if (
        this.puesto.descripcion=="" ||
        this.puesto.descripcion==undefined
      ) {
        this.toastr.info("Debe ingresar una descripción");
        flag = true;
      } else if (
        this.puesto.ubicacion=="" ||
        this.puesto.ubicacion==undefined
      ) {
        this.toastr.info("Debe ingresar una ubicación");
        flag = true;
      } else if (
        this.puesto.estado==0 ||
        this.puesto.estado==undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  crearPuestoMercado() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Puesto de mercado?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Guardando Puesto de mercado...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                puesto: this.puesto
              }
  
              this.puestoSrv.savePuesto(data).subscribe(
                  (res) => {
                      console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Puesto de mercado Creado",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.commonVarSrv.needRefresh.next(this.needRefresh);
                          this.activeModal.close();
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

  editPuestoMercado() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea actualizar este Puesto de mercado?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Guardando Puesto de mercado...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                puesto: this.puesto
              }
  
              this.puestoSrv.updatePuesto(data).subscribe(
                  (res) => {
                      console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Puesto de mercado Actualizado",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.commonVarSrv.needRefresh.next(this.needRefresh);
                          this.activeModal.close();
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

}
