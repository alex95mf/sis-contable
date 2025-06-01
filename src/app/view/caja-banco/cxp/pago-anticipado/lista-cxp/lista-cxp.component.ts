import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { PagoAnticipadoService } from '../pago-anticipado.service';

import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-lista-cxp',
  templateUrl: './lista-cxp.component.html',
  styleUrls: ['./lista-cxp.component.scss']
})
export class ListaCxpComponent implements OnInit {

  constructor(
    private pagoAnticipadoService: PagoAnticipadoService,
  ) { }

  @Input() selectCxP: any;

  ngOnInit(): void {
  }


  @Output() onSeleccionarCxP: EventEmitter<any> = new EventEmitter();
  seleccionarCxP(item) {
    this.onSeleccionarCxP.emit({
      items: item,
    });
  }

  @Output() onModPagoAnt: EventEmitter<any> = new EventEmitter();
  modPagoAnt(item) {
    this.onModPagoAnt.emit({
      items: item,
    });
  }

  mapearEstados(valor:any){
    if (valor=="A"){
      return "ACTIVO";
    }
    if (valor=="P"){
      return "PAGADO";
    }
    if (valor=="I"){
      return "ANULADO";
    }
  } 

  /**LISTADO */
  dataSourceCxP:any = [];
  dataAnteriorCxP:any = [];
  @ViewChild(DataTableDirective) dtElementCxP: DataTableDirective;
  dtOptionsCxP: DataTables.Settings = {};
  dtTriggerCxP = new Subject();
  presentarRadio:boolean = false;
  listadoGeneralCxP(lIdProveedor, lfecha, lEstado): any {

    this.dtOptionsCxP = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      searching: false,
      paging: true,
      order: [[ 0, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      idProveedor: lIdProveedor,
      lfecha: lfecha,
      lEstado: lEstado
    };
    this.pagoAnticipadoService.obtenerCuentasPorPagar(data).subscribe((res) => {
      this.dataSourceCxP = res["data"];
      this.dataAnteriorCxP = JSON.stringify(res["data"]);
      this.dataAnteriorCxP = JSON.parse(this.dataAnteriorCxP);

      setTimeout(() => {
        this.dtTriggerCxP.next();
      }, 50);
      
    }, (error) => {

    });
  }
  
  recargarCxP(lIdProveedor, lfecha, lEstado){
    if(this.dtElementCxP.dtInstance){
      this.dtElementCxP.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.listadoGeneralCxP(lIdProveedor, lfecha, lEstado);
      });
    }else{
      this.listadoGeneralCxP(lIdProveedor, lfecha, lEstado);
    }
  }  
  
  /**LISTADO */

}
