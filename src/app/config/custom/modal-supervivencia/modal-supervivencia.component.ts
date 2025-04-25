import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalSupervivenciaService } from './modal-supervivencia.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { List } from '@amcharts/amcharts4/core';

import * as moment from 'moment';
@Component({
  selector: 'app-modal-supervivencia',
  templateUrl: './modal-supervivencia.component.html',
  styleUrls: ['./modal-supervivencia.component.scss']
})
export class ModalSupervivenciaComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @Input() id_contribuyente: number;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) barra_carga: CcSpinerProcesarComponent;
  botonera: any = [];
  necesita_refrescar: any;
  contribuyente_sup: any;
  @Input() contribuyenteActive: any = {};


  constructor(
    public modal: NgbActiveModal,
    private svrToStar: ToastrService,
    private commonService: CommonService,
    private srvLTur: ModalSupervivenciaService,
    private srvLTurV: CommonVarService,
  ) {
  }

  ngOnInit(): void {
    this.botonera = [
      {
        orig: "btnsFormLTuristicos",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsFormLTuristicos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      }
    ];
    this.contribuyente_sup = {
      supervivencia: "",
      fk_contribuyente: null,
      fecha_registro: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",

    };
    console.log(this.id_contribuyente)
    setTimeout(() => {
      if (this.id_contribuyente > 0) {
        this.contribuyente_sup.fk_contribuyente = this.id_contribuyente;
      };
    }, 0);
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.guardar();
        break;
      case "REGRESAR":
        console.log("cerrar");
        this.regresar();
        break;
    }
  }


  regresar() {
    this.cerrarModal();
    this.srvLTurV.limpiarSupervivencia.next({})
  }

  guardar() {
    this.crearSupervivencia();
  }

  crearSupervivencia() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea agregar supervivencia?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {
        this.texto_barra_carga = "Guardando"
        this.barra_carga.ctlSpinner(true);
        console.log(this.contribuyente_sup.fk_contribuyente);

        let data = {
          supervivencia: this.contribuyente_sup.supervivencia,
          id_cliente: this.contribuyente_sup.fk_contribuyente,
          fecha_registro: this.contribuyente_sup.fecha_registro,
        };
        this.srvLTur.updateContribuyente(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.necesita_refrescar = true;
              this.barra_carga.ctlSpinner(false);
            }
          })
        let datos = {
          supervivencia: this.contribuyente_sup.supervivencia,
          fk_contribuyente: this.contribuyente_sup.fk_contribuyente,
          fecha_registro: this.contribuyente_sup.fecha_registro,
          observacion: this.contribuyente_sup.observacion,
        };
        console.log(datos);
        this.srvLTur.crearCSupervivencia(datos).subscribe(
          (res) => {
            console.log(res)
            if (res["status"] == 1) {
              this.necesita_refrescar = true;
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Se agrego supervivencia",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log('hola')
                  this.cerrarModal();
                }
              });
            }
            else {
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
            this.svrToStar.info(error.error.message);
          }
        )
      }
    })
  }
}
