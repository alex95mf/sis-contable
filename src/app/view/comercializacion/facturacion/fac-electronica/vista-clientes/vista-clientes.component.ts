import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ChequeProtestadoService } from 'src/app/view/caja-banco/cuentas/cheque-protestado/cheque-protestado.service';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { PaginatorService } from '../../../../../config/custom/paginator/paginator.service';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { FacElectronicaService } from '../fac-electronica.service';

@Component({
standalone: false,
  selector: 'app-vista-clientes',
  templateUrl: './vista-clientes.component.html',
  styleUrls: ['./vista-clientes.component.scss']
})
export class VistaClientesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VistaClientesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chequeProtestadoService: ChequeProtestadoService
  ) { }

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsBusqClte", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}

    ];

    setTimeout(() => {
      this.obtenerDocumentos();
    }, 10);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }


  listadoGeneral:any=[];
  obtenerDocumentos(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
    };

    let filtros:any = {
      lBanco: null,
      lNombreCliente: null,
      lFechaDesde: null,
      lFechaHasta: null,
      estado: this.data.lEstado
    }
    
    this.lcargando.ctlSpinner(true);
    this.chequeProtestadoService.obtenerCheques(filtros).subscribe((res:any) => {    
      console.log("obtenerCheques: ", res.data);
      this.lcargando.ctlSpinner(false);

      let arregloClientes:any = [];
      res.data.forEach(element => {
        arregloClientes.push(element._ven_cliente);
      });

      let arregloNoDuplicado:any = this.validaciones.removeDuplicates(arregloClientes, "id_cliente");

      this.listadoGeneral = arregloNoDuplicado;

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);

      
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });


  }

  seleccionarItem(item:any){
    this.dialogRef.close(item);
  }

}
