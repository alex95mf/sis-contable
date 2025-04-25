import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { CajasService } from '../cajas.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'app-cajas-form',
  templateUrl: './cajas-form.component.html',
  styleUrls: ['./cajas-form.component.scss']
})
export class CajasFormComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() usuariosList: any = [];
  @Input() establecimientosList: any = [];

  vmButtons: any;

  needRefresh: boolean = false;

  estadoList = [
    {
        value: "A",
        label: "Activo"
    },
    {
        value: "I",
        label: "Inactivo"
    },
  ]

  nuevoEst: boolean = false;

  caja: any;

  constructor(
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private apiSrv: CajasService,
    private commonVarSrv: CommonVarService,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnCajasForm",
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
          orig: "btnCajasForm",
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

  this.caja = {
    id_caja: 0,
    codigo: "",
    nombre: "",
    establecimiento: 0,
    establecimiento_nuevo: "",
    fk_usuario_caja: 0,
    estado: "A"
  }

  setTimeout(() => {
    if(!this.isNew) {
      this.caja = {
        id_caja: this.data.id_caja,
        codigo: this.data.codigo,
        nombre: this.data.nombre,
        establecimiento: this.data.establecimiento,
        fk_usuario_caja: this.data.usuario.id_usuario,
        estado: this.data.estado
      }
    }

  }, 0);


  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaCaja();
            break;
    }
  }

  handleEstablecimiento(evento) {
    console.log(evento);

    if(evento==1){
      this.nuevoEst = true;
    }else{
      this.nuevoEst = false;
    }
  }

  async validaCaja() {
    if(this.isNew && this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevas Cajas");
  
    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Cajas.", this.fTitle);
    } else {
        let resp = await this.validaDataGlobal().then((respuesta) => {
          if(respuesta) {
            if (this.isNew) {
              this.crearCaja();
            } else {
              this.editCaja();
            }
          }
        });
  
    }
  }
  
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.caja.nombre == "" ||
        this.caja.nombre == undefined
      ) {
        this.toastr.info("El campo Nombre no puede ser vacío");
        flag = true;
      } else if(
        this.caja.fk_usuario_caja == 0 ||
        this.caja.fk_usuario_caja == undefined
      ) {
        this.toastr.info("Debe seleccionar un usuario para la caja");
        flag = true;
      } else if(
        this.caja.codigo == "" ||
        this.caja.codigo == undefined  
      ) {
        this.toastr.info("El campo Código no puede ser vacío");
        flag = true;
      } else if (
        this.caja.establecimiento == 0 ||
        this.caja.establecimiento == undefined
      ) {
        this.toastr.info("El campo Establecimiento no puede ser vacío");
        flag = true;   
      } else if (
        this.caja.establecimiento == 1 &&
        (this.caja.establecimiento_nuevo == "" || this.caja.establecimiento_nuevo == undefined)
      ) {
        this.toastr.info("Debe agregar un nuevo Establecimiento");
        flag = true;    
      } else if(
        this.caja.estado == 0 ||
        this.caja.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  crearCaja() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva caja?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              this.mensajeSppiner = "Guardando Caja...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                caja: this.caja
              }
  
              this.apiSrv.createCaja(data).subscribe(
                  (res) => {
                      console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Caja Creada",
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
  
  editCaja() {
    Swal.fire({
      icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea editar esta Caja?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
          this.mensajeSppiner = "Guardando Caja..."
          this.lcargando.ctlSpinner(true);
  
          let data = {
            caja: this.caja
          }

          let id = this.caja.id_caja;
  
          this.apiSrv.editCaja(id, data).subscribe(
              (res) => {
                  if (res["status"] == 1) {
                  this.needRefresh = true;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                      icon: "success",
                      title: "Caja Actualizada",
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

  closeModal() {
    this.commonVarSrv.needRefresh.next(this.needRefresh);
    this.activeModal.dismiss();
  }

}
