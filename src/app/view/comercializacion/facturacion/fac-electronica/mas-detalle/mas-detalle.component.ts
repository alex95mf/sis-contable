import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaginatorService } from '../../../../../config/custom/paginator/paginator.service';

@Component({
standalone: false,
  selector: 'app-mas-detalle',
  templateUrl: './mas-detalle.component.html',
  styleUrls: ['./mas-detalle.component.scss']
})
export class MasDetalleComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MasDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paginadorServicio: PaginatorService
  ) { }

  vmButtons: any = [];
  razonSocial:any = "";
  lUsuario:any = "";

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnMasDetDoc", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}

    ];
    
    if(this.data.itemSeleccionado.fk_tipo_documento == 1){
      this.razonSocial = this.data.itemSeleccionado._venta.client.razon_social;
      this.lUsuario = this.data.itemSeleccionado._venta.creator.usuario + " / " + this.data.itemSeleccionado._venta.creator.nombre;
    }else if(this.data.itemSeleccionado.fk_tipo_documento == 2){
      this.razonSocial = this.data.itemSeleccionado._compras.proveedor.razon_social;
      this.lUsuario = this.data.itemSeleccionado._compras.usuario.usuario + " / " + this.data.itemSeleccionado._compras.usuario.nombre;
    }else if(this.data.itemSeleccionado.fk_tipo_documento == 3){
      this.razonSocial = this.data.itemSeleccionado._notas_cab._venta.client.razon_social;
      this.lUsuario = this.data.itemSeleccionado._notas_cab._venta.creator.usuario + " / " + this.data.itemSeleccionado._notas_cab._venta.creator.nombre;
    }else if(this.data.itemSeleccionado.fk_tipo_documento == 6){
      this.razonSocial = this.data.itemSeleccionado._retencion_cab._compras.proveedor.razon_social;
      this.lUsuario = this.data.itemSeleccionado._retencion_cab._compras.usuario.usuario + " / " + this.data.itemSeleccionado._retencion_cab._compras.usuario.nombre;
    }
    

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }

}
