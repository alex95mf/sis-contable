import { Component, OnInit, Input } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "cc-spiner-procesar",
  template: `<ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="large" color="#607ec9" type="ball-spin-clockwise-fade" [fullScreen]="lfulScren" [name]="lTipo">
  <p style="color: white" >{{ ltexto }}</p>
  </ngx-spinner>`,
})


export class CcSpinerProcesarComponent implements OnInit {
  @Input() ltexto: string = "Cargando....";
  @Input() lfulScren: boolean = true;
  @Input() lTipo: any = "";

  imagenCargando= `<img src="assets/img/cargando.gif" >`;

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {}

  public ctlSpinner(valor: boolean): void {
    if (valor) {
      this.spinner.show(this.lTipo);
    } else {
      this.spinner.hide(this.lTipo);
    }
  }

  public ctlMensaje(texto: string): void {
    this.ltexto=texto;

  }


}
