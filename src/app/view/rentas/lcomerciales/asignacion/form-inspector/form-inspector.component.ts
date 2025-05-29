import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AsignacionService } from '../asignacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-form-inspector',
  templateUrl: './form-inspector.component.html',
  styleUrls: ['./form-inspector.component.scss']
})
export class FormInspectorComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;

  datos_usuario: any;

  @Input() permisos: any;
  @Input() titulo: any;
  @Input() tipo_inspeccion: any;
  @Input() id_inspeccion_res: any;
  @Input() fk_inspector: any;
  @Input() fecha_asignacion: any;

  botonera: any;

  inspeccion: any;

  lista_inspectores: any = [];

  necesita_refrescar: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private srvTostar: ToastrService,
    private srvCom: CommonService,
    private srvAsignacion: AsignacionService,
    private srvVarCom: CommonVarService
  ) { }

  ngOnInit(): void {
    this.botonera = [
      {
          orig: "formBtnInspector",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " CONFIRMAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false
      },
      {
          orig: "formBtnInspector",
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

    this.inspeccion = {
      fecha_asignacion: this.fecha_asignacion ? moment(this.fecha_asignacion).format("YYYY-MM-DD")  : moment(new Date()).format('YYYY-MM-DD'),
      fk_inspector: this.fk_inspector
    };

    setTimeout(() => {
      this.llenarInspectores();
    }, 0);
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.cerrarModal();
        break;

        case " CONFIRMAR":
          this.asignarInspector();
          break;
    }
  }

  async asignarInspector() {
    let resp = await this.validarAsignacionInspector().then((respuesta) => {
      if(respuesta) {
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea asignar este Inspector?.",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74'
        }).then((result) => {
          if (result.isConfirmed) {
            this.texto_barra_carga = "Asignando Inspector..."
            this.barra_carga.ctlSpinner(true);

            let datos = {
              inspeccion: {
                fecha_asignacion: this.inspeccion.fecha_asignacion,
                fk_inspector: this.inspeccion.fk_inspector
              }
            };
            console.log(this.inspeccion);
            this.srvAsignacion.asignarInspector(this.id_inspeccion_res, datos).subscribe(
              (res) => {
                if (res["status"] == 1) {
                  this.necesita_refrescar = true;
                  this.barra_carga.ctlSpinner(false);
                  Swal.fire({
                      icon: "success",
                      title: "Inspector asignado con éxito.",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
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
                      confirmButtonColor: '#20A8D8',
                  });
                }
              },
              (error) => {
                this.barra_carga.ctlSpinner(false);
                this.srvTostar.info(error.error.message);
              }
            );
          }
        });
      }
    });
  }

  llenarInspectores() {
    this.texto_barra_carga = "Cargando Inspectores...";
    this.barra_carga.ctlSpinner(true);

    let datos = {
      params: {
        tipo_inspeccion: this.tipo_inspeccion
      }
    };

    this.srvAsignacion.obtenerInspectores(datos).subscribe(
      (res) => {
        this.lista_inspectores = res['data'];
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  validarAsignacionInspector() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.inspeccion.fk_inspector == 0 ||
        this.inspeccion.fk_inspector == undefined  
      ) {
        this.srvTostar.info("Debe seleccionar un inspector");
        flag = true;
      }
        !flag ? resolve(true) : resolve(false);
    });
  }

  cerrarModal() {
    this.srvVarCom.editAsignacion.next(this.necesita_refrescar);
    this.modal.dismiss();
  }

}
