import { ViewChild,EventEmitter,Component, AfterViewChecked,Output } from '@angular/core';
import { CustonService } from '../app-custom.service';
/*import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
*/

import { ComprasService } from 'src/app/view/proveeduria/compras/compras.service';

import { CcSpinerProcesarComponent } from '../cc-spiner-procesar.component';
/*
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
*/

import { LazyLoadEvent } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

import { ChangeDetectorRef } from '@angular/core';


@Component({
standalone: false,
  template:  `
          <p-table
            [value]="proveedores"
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
          <ng-template pTemplate="header" [headerStyle]="{'font-size': '0.7rem'}">
              <tr style="font-size:12px;">
                  <th>id</th>
                  <th pSortableColumn="tipo_documento">Tipo <p-sortIcon field="tipo_documento"></p-sortIcon></th>
                  <th pSortableColumn="num_documento">Numero Documento <p-sortIcon field="num_documento"></p-sortIcon></th>
                  <th pSortableColumn="nombre_comercial_prov">Razon Social <p-sortIcon field="nombre_comercial_prov"></p-sortIcon></th>
              </tr>
              <tr>
                <th></th>
                <th>
                    <p-columnFilter type="text" field="tipo_documento"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" field="num_documento"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" field="razon_social"></p-columnFilter>
                </th>
              </tr>
          </ng-template>
          <ng-template pTemplate="body" let-proveedor>
              <tr [pSelectableRow]="proveedor" style="font-size:11px;">
                  <td>{{proveedor.id_proveedor}}</td>
                  <td>{{proveedor.tipo_documento}}</td>
                  <td>{{proveedor.num_documento}}</td>
                  <td>{{proveedor.razon_social}}</td>
              </tr>
          </ng-template>
        </p-table> `
})

export class CcModalTablaProveedoresComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }



  proveedores : any;
  totalRecords: number;

  loading: boolean;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  busqueda = "";

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Output() EventElemntRow = new EventEmitter();


  constructor(private cdRef:ChangeDetectorRef,public ref: DynamicDialogRef,private entityService: CustonService,private primengConfig: PrimeNG,private comSrv: ComprasService) { }

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
      busqueda: localStorage.getItem("busqueda_proveedores"),
      filters: event.filters
    }

    this.comSrv.getProveedoresTotalRegistros(consulta).subscribe(resTotales => {

      setTimeout(() => {


        let datosPost: any = {

          busqueda: localStorage.getItem("busqueda_proveedores"),
          sort_acti: (event.sortField == undefined) ? 'id_proveedor' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.first,
          index: event.rows,
          filters: event.filters
        }

        this.entityService.getProveedores(datosPost).subscribe(
          (res) => {
            console.log(res)

            this.proveedores = res["data"];
            this.totalRecords = resTotales["data"][0].total;

            this.loading = false;
            //this.lcargando.ctlSpinner(false);


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
