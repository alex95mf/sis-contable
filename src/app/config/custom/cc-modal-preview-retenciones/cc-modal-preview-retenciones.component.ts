import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { CustonService } from '../app-custom.service';
import { ChangeDetectorRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import * as internal from 'stream';

@Component({
  template:  `
  <p-table 
    [value]="impuestos" 
    [lazy]="true" 
    (onLazyLoad)="CargaImpuestosRetencion($event)" 
    selectionMode="single" 
    (onRowSelect)="onRowSelect($event)"
    responsiveLayout="scroll" 
    [paginator]="false" 
    [loading]="loading" 
    [showCurrentPageReport]="true">
  >
  <ng-template pTemplate="header">
      <tr>
          <th>Codigo Impuesto</th>
          <th>Codigo Anexo</th>
          <th style="text-align: end;">Base</th>
          <th style="text-align: end;">Porcentaje</th>
          <th style="text-align: end;">Valor Retención</th>
      </tr>
  </ng-template>
  <ng-template pTemplate="body" let-impuestos>
      <tr [pSelectableRow]="impuestos">
          <td style="height: 42px;">{{impuestos.codigo_impuesto}}</td>
          <td style="height: 42px;">{{impuestos.codigo_anexo_sri}}</td>
          <td style="height: 42px; text-align: end;">$ {{impuestos.base | number:'1.2-2'}}</td>
          <td style="height: 42px; text-align: end;">{{impuestos.porcentaje_retencion | number:'1.2-2'}} %</td>
          <td style="height: 42px; text-align: end; font-weight: 900;">$ {{impuestos.valor_retencion | number:'1.2-2'}}</td>
      </tr>
  </ng-template>

  
</p-table> `
})
export class CcModalPreviewRetencionesComponent implements AfterViewChecked {

  impuestos:any;
  loading: boolean;

  id_compra:number;
  totalRetencion:number = 0;

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  constructor(private cdRef:ChangeDetectorRef,private comSrv: CustonService,public config: DynamicDialogConfig,) { }

  ngOnInit(): void {

    let dtaReten = this.config.data;
    this.id_compra = dtaReten.id_compra;

    console.log(this.id_compra);

  }


  CargaImpuestosRetencion(event: LazyLoadEvent) {


    

    this.loading = true;

    let consulta = {
      fk_com_cab: this.id_compra
    }

    this.comSrv.obteneDetalleImpuestoRetencion(consulta).subscribe(respuesta => {


      setTimeout(() => {
       
        this.impuestos = respuesta["data"];
        this.loading = false;

        let retencionTotal = 0;
        this.impuestos.forEach(e => {
          retencionTotal += +e.valor_retencion; 
        });
        this.totalRetencion=retencionTotal

        console.log(respuesta);

      }, 1000);
     

    }, error => {
      
    })

  }

}
