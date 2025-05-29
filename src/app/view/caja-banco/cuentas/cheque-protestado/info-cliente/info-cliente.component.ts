import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IngChqProtestadoComponent } from '../ing-chq-protestado/ing-chq-protestado.component';

@Component({
standalone: false,
  selector: 'app-info-cliente',
  templateUrl: './info-cliente.component.html',
  styleUrls: ['./info-cliente.component.scss']
})
export class InfoClienteComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<IngChqProtestadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  vmButtons:any = [];

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnInfoCli", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false},
    ];

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR": 
        this.dialogRef.close(false);
      break;
    }   
  }

}
