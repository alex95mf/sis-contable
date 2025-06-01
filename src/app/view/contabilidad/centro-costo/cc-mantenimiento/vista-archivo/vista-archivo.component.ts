import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-vista-archivo',
  templateUrl: './vista-archivo.component.html',
  styleUrls: ['./vista-archivo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VistaArchivoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VistaArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  vmButtons:any = [];
  generalDocument: any = "assets/img/vista.png"; 
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnVistaFile", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false}
    ];
    
    
    setTimeout(() => {
      const objectUrl: string = this.data.objectUrl;

      this.generalDocument = objectUrl;

      if (this.data.tipoArchivo === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
         ||this.data.tipoArchivo ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         ||this.data.tipoArchivo ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'
         || this.data.tipoArchivo==="application/msword"
       ) {
        this.dialogRef.close(false);
      }
    }, 100);
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }

}
