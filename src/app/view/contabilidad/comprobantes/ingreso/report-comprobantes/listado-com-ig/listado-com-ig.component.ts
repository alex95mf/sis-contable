import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonVarService } from '../../../../../../services/common-var.services';

@Component({
standalone: false,
  selector: 'app-listado-com-ig',
  templateUrl: './listado-com-ig.component.html',
  styleUrls: ['./listado-com-ig.component.scss']
})
export class ListadoComIgComponent implements OnInit {

  vmButtons:any = [];

  constructor(
    private dialogRef: MatDialogRef<ListadoComIgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonVarSrv: CommonVarService
  ) { }

  dtcomprobanteIngreso: Array<any> = [];
  dtInformacion: any = {};

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnInfDocComIg", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.dtInformacion = this.data.dtInformacion;
      this.dtcomprobanteIngreso = this.data.dtcomprobanteIngreso;
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
