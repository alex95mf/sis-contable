import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ValidacionesFactory } from "../utils/ValidacionesFactory";

@Component({
standalone: false,
  selector: "app-mspregunta",
  templateUrl: "./mspregunta.component.html",
  styleUrls: ["./mspregunta.component.scss"],
})
export class MspreguntaComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private activeModale: NgbModal
  ) {}

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  variable: any;
  mensaje: any = "";
  title: any = "";
  lObservacion:any = "";
  lCorreo:any = "";
  phObservacion:any = "";
  phCorreo:any = "";

  ngOnInit() {
    this.mensaje = this.variable.mensaje;
    this.title = this.variable.titulo;
    this.lObservacion = "";
    this.lCorreo = "";
    if(this.validaciones.verSiEsNull(this.variable.phObservacion) != undefined){
      this.phObservacion = this.variable.phObservacion;
    }

    if(this.validaciones.verSiEsNull(this.variable.phCorreo) != undefined){
      this.phCorreo = this.variable.phCorreo;
    }
  }

  dismiss() {
    this.activeModal.dismiss();
    this.activeModale.dismissAll();
  }

  decline() {
    let item:any = {
      valor: false
    }
    this.activeModal.close(item);
    this.activeModale.dismissAll();
  }

  accept() {

    if(this.validaciones.verSiEsNull(this.variable.phCorreo) != undefined){
      if(this.validaciones.verSiEsNull(this.lCorreo) == undefined){
        this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingrese un correo electrónico receptor");
        return;
      }
      if(this.validaFormatoCorreo(this.lCorreo) != "OK"){ 
        this.validaciones.mensajeAdvertencia("Advertencia","El formato del correo electrónico ingresado es incorrecto, por favor ingrese otro.");
        return;
      }
    }

    if(this.validaciones.verSiEsNull(this.variable.phObservacion) != undefined){
      if(this.validaciones.verSiEsNull(this.lObservacion) == undefined){
        this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingrese un motivo");
        return;
      }
    }
    
    let item:any = {
      valor: true,
      observacion: this.lObservacion,
      lCorreo: this.lCorreo
    }
    this.activeModal.close(item);
    this.activeModale.dismissAll();
  }

  validaFormatoCorreo(email:any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email) == false) {
      return("La Direcci\u00F3n de Correo es Invalida.");
    }
    return "OK";
  }
}
