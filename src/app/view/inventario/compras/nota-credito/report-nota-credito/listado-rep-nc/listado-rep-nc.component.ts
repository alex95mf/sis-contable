import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
standalone: false,
  selector: 'app-listado-rep-nc',
  templateUrl: './listado-rep-nc.component.html',
  styleUrls: ['./listado-rep-nc.component.scss']
})
export class ListadoRepNcComponent implements OnInit {

  vmButtons:any = [];

  constructor(
    private dialogRef: MatDialogRef<ListadoRepNcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  dtnotaCredito: Array<any> = [];
  dtInformacion: any = {};

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnInfDocNc", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.dtInformacion = this.data.dtInformacion;
      this.dtnotaCredito = this.data.dtnotaCredito;
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
