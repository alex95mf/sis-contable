import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { CcMantenimientoService } from '../cc-mantenimiento.service';

@Component({
standalone: false,
  selector: 'app-cc-clientes',
  templateUrl: './cc-clientes.component.html',
  styleUrls: ['./cc-clientes.component.scss']
})
export class CcClientesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CcClientesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private centroCostoSrv: CcMantenimientoService
  ) { }

  vmButtons:any = [];
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnCcCliente", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false}
    ];

    setTimeout(() => {
      this.obetenerCliente();  
    }, 10);
    
  }
  
  lstClientes: Array<any> = [];
  dtOptions: any = {};
  dtTrigger = new Subject();
  obetenerCliente(){

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "300px",
      scrollCollapse: true,
      dom: "frtip",
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    this.mensajeSppiner = "Cargando listado de clientes...";
    this.lcargando.ctlSpinner(true);
    this.centroCostoSrv.obetenerClientes().subscribe((datos:any)=>{
      this.lstClientes = datos.data;
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
      console.log("this.lstClientes: ", this.lstClientes)
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }

  mapearEstados(valor:any){
    if (valor=="A"){
      valor = "ACTIVO";
    }
    if (valor=="I"){
      valor = "INACTIVO";
    }
    return valor;
  } 

  seleccionarCliente(valor:any){
    this.dialogRef.close(valor);
  }

}
