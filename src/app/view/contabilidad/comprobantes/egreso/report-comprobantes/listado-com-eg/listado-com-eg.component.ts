import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonVarService } from '../../../../../../services/common-var.services';

@Component({
  selector: 'app-listado-com-eg',
  templateUrl: './listado-com-eg.component.html',
  styleUrls: ['./listado-com-eg.component.scss']
})
export class ListadoComEgComponent implements OnInit {

  vmButtons:any = [];

  constructor(
    private dialogRef: MatDialogRef<ListadoComEgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonVarSrv: CommonVarService
  ) { }

  dtcomprobanteEgreso: Array<any> = [];
  dtInformacion: any = {};

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnInfDocComEg", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.dtInformacion = this.data.dtInformacion;
      this.dtcomprobanteEgreso = this.data.dtcomprobanteEgreso;
    }, 10);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "CERRAR2":
        this.dialogRef.close(false);
      break;
    }
  }

}
