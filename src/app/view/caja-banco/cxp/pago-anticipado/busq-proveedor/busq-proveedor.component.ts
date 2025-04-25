import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-busq-proveedor',
  templateUrl: './busq-proveedor.component.html',
  styleUrls: ['./busq-proveedor.component.scss']
})
export class BusqProveedorComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<BusqProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsBusqProve", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}

    ];

    this.listadoGeneral();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }

  /**LISTADO */
  dataSource: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  listadoGeneral(): any {

    
        
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      searching: true,
      scrollY: "200px",
      scrollCollapse: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.dataSource = this.data.listado;
    setTimeout(() => {
      this.dtTrigger.next();
    }, 50);
  }
  /**LISTADO */


  seleccionarProveedor(valor:any){
    this.dialogRef.close(valor);
  }
  

  mapearEstados(valor:any){
    if (valor=="A"){
      return "ACTIVO";
    }
    if (valor=="I"){
      return "INACTIVO";
    }
  } 

}
