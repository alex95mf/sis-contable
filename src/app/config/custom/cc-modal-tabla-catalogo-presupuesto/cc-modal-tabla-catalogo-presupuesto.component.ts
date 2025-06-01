import { ViewChild,EventEmitter,Component, OnInit, AfterViewChecked,Output } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustonService } from '../app-custom.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
standalone: false,
  template: `
    <p-table
      [value]="catalogo"
      [lazy]="true"
      (onLazyLoad)="CargaCatalogo($event)"
      selectionMode="single"
      [(selection)]="selectedProduct2"
      (onRowSelect)="onRowSelectCatalogo($event)"
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
            <th pSortableColumn="codigo">Codigo <p-sortIcon field="codigo"></p-sortIcon></th>
            <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
        </tr>
        <tr>
          <th>
              <p-columnFilter type="text" field="codigo"></p-columnFilter>
          </th>
          <th>
              <p-columnFilter type="text" field="nombre"></p-columnFilter>
          </th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-catalogo>
        <tr [pSelectableRow]="catalogo">
            <td>{{catalogo.codigo}}</td>
            <td>{{catalogo.nombre}}</td>
        </tr>
    </ng-template>
  </p-table> `
})
export class CcModalTablaCatalogoPresupuestoComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  catalogo: any;
  totalRecords: number;

  loading: boolean;


  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  isDetalle = false;
  busqueda = "";


  @Output() EventElemntRow = new EventEmitter();


  constructor
  (
    public ref: DynamicDialogRef,
    private entityService: CustonService,
    private primengConfig: PrimeNG,
    private cdRef:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  CargaCatalogo(event: LazyLoadEvent) {

    this.primengConfig.setTranslation({
      "startsWith": "Comienza con",
      "contains": "Contiene",
      "notContains": "No contiene",
      "endsWith": "Termina en",
      "equals": "Igual",
      "notEquals": "No igual",
      "noFilter": "Sin filtro",
    });

    // debugger;

    this.loading = true;
    this.isDetalle = localStorage.getItem("detalle_consulta") === "true"


    let consulta = {
      busqueda: localStorage.getItem("busqueda_presupuesto"),
      filters: event.filters,
      detalle:this.isDetalle
    }

    this.entityService.obteneCatalogoPresupuestoGeneralTotal(consulta).subscribe(resTotales => {


      setTimeout(() => {

        let datosPost: any = {

          busqueda: localStorage.getItem("busqueda_presupuesto"),
          sort_acti: (event.sortField == undefined) ? 'codigo' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.first,
          index: event.first + event.rows,
          filters: event.filters,
          detalle:this.isDetalle
        }

        this.entityService.obteneCatalogoPresupuestoGeneral(datosPost).subscribe(
          (res) => {


            this.catalogo = res["data"];
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

  onRowSelectCatalogo(catalogo) {
    this.ref.close(catalogo);
  }

}
