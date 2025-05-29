import { ViewChild, EventEmitter, Component, AfterViewChecked, Output } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustonService } from '../app-custom.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
standalone: false,
  template: `
          <p-table 
            [value]="productos" 
            [lazy]="true" 
            (onLazyLoad)="CargaProveedores($event)" 
            selectionMode="single" 
            [(selection)]="selectedProduct2"
            (onRowSelect)="onRowSelect($event)"
            responsiveLayout="scroll" 
            [paginator]="true" 
            [rows]="10" 
            [totalRecords]="totalRecords" 
            [loading]="loading" 
            [showCurrentPageReport]="true" 
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
            [rowsPerPageOptions]="[10,25,50]">
          <ng-template pTemplate="header">
              <tr>
                  <th>id</th>
                  <th pSortableColumn="codigo">Codigo <p-sortIcon field="codigo"></p-sortIcon></th>
                  <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
                  <th pSortableColumn="grupo.nombre">Grupo <p-sortIcon field="grupo.nombre"></p-sortIcon></th>
              </tr>
              <tr>
                <th></th>
                <th>
                    <p-columnFilter type="text" field="codigo"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" p="nombre"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" field="grupo.nombre"></p-columnFilter>
                </th>
              </tr>
          </ng-template>
          <ng-template pTemplate="body" let-producto>
              <tr [pSelectableRow]="producto">
                  <td>{{producto.id}}</td>
                  <td>{{producto.codigo}}</td>
                  <td>{{producto.nombre}}</td>
                  <td>{{producto.grupo.nombre}}</td>
              </tr>
          </ng-template>
        </p-table> `
})
export class CcModalTablaProductosComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  productos: any;
  totalRecords: number;

  loading: boolean;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  busqueda = "";

  constructor(
    public ref: DynamicDialogRef,
    private entityService: CustonService,
    private primengConfig: PrimeNGConfig,
    private cdRef:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }


  CargaProveedores(event: LazyLoadEvent) {

    this.primengConfig.setTranslation({
      "startsWith": "Comienza con",
      "contains": "Contiene",
      "notContains": "No contiene",
      "endsWith": "Termina en",
      "equals": "Igual",
      "notEquals": "No igual",
      "noFilter": "Sin filtro",
    });

    this.loading = true;

    let consulta = {
      busqueda: '',
      filters: event.filters
    }


    this.entityService.ObtenerProductosPaginTotal(consulta).subscribe(resTotales => {

      setTimeout(() => {

        let datosPost: any = {
          busqueda: "",
          sort_acti: (event.sortField == undefined) ? 'id' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.first,
          index: event.first + event.rows,
          filters: event.filters
        }

        this.entityService.ObtenerProductosPagin(datosPost).subscribe(
          (res) => {

            this.productos = res["data"];
            this.totalRecords = resTotales["data"][0].total;

            this.loading = false;


          },
          (error) => {
            this.loading = false;
          }
        );

      }, 1000);

    }, error => {

    })

  }


  onRowSelect(product) {
    this.ref.close(product);
  }

}
