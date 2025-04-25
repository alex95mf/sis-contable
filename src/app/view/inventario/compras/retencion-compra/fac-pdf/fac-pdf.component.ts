import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fac-pdf',
  templateUrl: './fac-pdf.component.html',
  styleUrls: ['./fac-pdf.component.scss']
})
export class FacPdfComponent implements OnInit {


  dataUser: any;
  vmButtons: any = [];
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  constructor(
    private dialogRef: MatDialogRef<FacPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnPrevPdfFat", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "IMPRIMIR RETENCIÓN" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section-doc-elec", imprimir: true },
      { orig: "btnPrevPdfFat", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ];

    this.dataUser = this.data.dataUser;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }
  }

}
