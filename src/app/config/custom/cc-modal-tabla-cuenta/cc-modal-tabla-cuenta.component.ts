import { ViewChild,EventEmitter,Component, OnInit, AfterViewChecked,Output } from '@angular/core';
import { PlanCuentasService } from 'src/app/view/contabilidad/plan-cuentas/plan-cuentas.service';

import { LazyLoadEvent } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustonService } from '../app-custom.service';

import { ChangeDetectorRef } from '@angular/core';


@Component({
  template: `
    <p-table 
      [value]="cuentas" 
      [lazy]="true" 
      (onLazyLoad)="CargaCuentas($event)" 
      selectionMode="single" 
      [(selection)]="selectedProduct2"
      (onRowSelect)="onRowSelectCuenta($event)"
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
            <th pSortableColumn="grupo">Grupo <p-sortIcon field="grupo"></p-sortIcon></th>
        </tr>
        <tr>
          <th>
              <p-columnFilter type="text" field="codigo"></p-columnFilter>
          </th>
          <th>
              <p-columnFilter type="text" field="nombre"></p-columnFilter>
          </th>
          <th>
              <p-columnFilter type="text" field="grupo"></p-columnFilter>
          </th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-cuenta>
        <tr [pSelectableRow]="cuenta">
            <td>{{cuenta.codigo}}</td>
            <td>{{cuenta.nombre}}</td>
            <td>{{cuenta.tipo}}</td>
        </tr>
    </ng-template>
  </p-table> `
})

export class CcModalTablaCuentaComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  cuentas: any;
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
    //private entityService: PlanCuentasService,
    public ref: DynamicDialogRef,
    private entityService: CustonService,
    private primengConfig: PrimeNGConfig,
    private cdRef:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    //this.CargaCuentas();
  }

 // CargaCuentas(event: LazyLoadEvent) {
  CargaCuentas(event: LazyLoadEvent) {

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
    this.isDetalle = localStorage.getItem("detalle_consulta") === "true"
    

    let consulta = {
      busqueda: localStorage.getItem("busqueda_cierre"),
      filters: event.filters,
      detalle:this.isDetalle
    }
console.log("116");
    this.entityService.obtenePlanCuentaGeneralTotal(consulta).subscribe(resTotales => {

      setTimeout(() => {

        

        let datosPost: any = {

          busqueda: localStorage.getItem("busqueda_cierre"),
          sort_acti: (event.sortField == undefined) ? 'codigo' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.first,
          index: event.rows,
          filters: event.filters,
          detalle:this.isDetalle
        }

        this.entityService.obtenePlanCuentaGeneral(datosPost).subscribe(
          (res) => {

            this.cuentas = res["data"];
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

  onRowSelectCuenta(cuentas) {
    this.ref.close(cuentas);
  }


/*}}
  ngOnInit(): void {



  }

  ngAfterViewInit(): void {


    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {

          this.isLoadingResults = true;

          this.resultsLength = parseInt(localStorage.getItem("total_cuetas"));
          this.busqueda = localStorage.getItem("busqueda_cuetas");
          this.isDetalle = localStorage.getItem("detalle_consulta") === "true"

          let con = {
            "busqueda" : this.busqueda,
            "sort_acti": this.sort.active,
            "sort_direc": this.sort.direction,
            "index": (this.paginator.pageIndex) > 0 ? this.paginator.pageIndex * this.paginator.pageSize : 0,
            "page_size": this.paginator.pageSize,
            "total": (total) => this.resultsLength = total,
            "detalle":this.isDetalle
          }

          return this.entityService.obtenePlanCuentaGeneral(con);
        
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.entitiesDataSource.data = data["data"]);

  }

  getClicRow( event:any){
    this.EventElemntRow.emit(event);
  }
  */


}
