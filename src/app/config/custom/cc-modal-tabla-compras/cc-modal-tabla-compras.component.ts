import { ViewChild,EventEmitter,Component, OnInit, AfterViewChecked,Output } from '@angular/core';

import { CustonService } from '../app-custom.service';
import { CcSpinerProcesarComponent } from '../cc-spiner-procesar.component';
import { ComprasService } from 'src/app/view/proveeduria/compras/compras.service';



import { LazyLoadEvent } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

import { ChangeDetectorRef } from '@angular/core';


@Component({
standalone: false,
  template:  `
          <p-table
            [value]="compras"
            [lazy]="true"
            (onLazyLoad)="CargaRegistroCompras($event)"
            selectionMode="single"
            (onRowSelect)="onRowSelect($event)"
            responsiveLayout="scroll"
            [paginator]="true"
            [rows]="10"
            [totalRecords]="totalRecords"
            [loading]="loading"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
            [rowsPerPageOptions]="[10,25,50]">
          >
          <ng-template pTemplate="header">
              <tr>
                  <th>id</th>
                  <th pSortableColumn="fecha_compra">Fecha <p-sortIcon field="fecha_compra"></p-sortIcon></th>
                  <th pSortableColumn="num_doc">Numero Documento <p-sortIcon field="num_doc"></p-sortIcon></th>
                  <th pSortableColumn="ruc">Ruc <p-sortIcon field="ruc"></p-sortIcon></th>
                  <th pSortableColumn="razon_social">Razon Social <p-sortIcon field="razon_social"></p-sortIcon></th>
              </tr>
              <tr>
                <th></th>
                <th>
                    <p-columnFilter type="text" field="fecha_compra"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" field="num_doc"></p-columnFilter>
                </th>
                <!--th>
                    <p-columnFilter type="text" field="ruc"></p-columnFilter>
                </th>
                <th>
                    <p-columnFilter type="text" field="razon_social"></p-columnFilter>
                </th-->
              </tr>
          </ng-template>
          <ng-template pTemplate="body" let-compras>
              <tr [pSelectableRow]="compras">
                  <td>{{compras.id}}</td>
                  <td>{{compras.fecha_compra}}</td>
                  <td>{{compras.num_doc}}</td>
                  <td>{{compras.ruc}}</td>
                  <td>{{compras.proveedor.razon_social}}</td>
              </tr>
          </ng-template>
        </p-table> `
})
export class CcModalTablaComprasComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  //private displayedColumns = ['id','fecha_compra','num_doc', 'ruc', 'razon_social'];

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  busqueda = "";
  loading: boolean;

  compras : any;
  totalRecords: number;

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Output() EventElemntRow = new EventEmitter();


  constructor
  (
    private entityService: CustonService,
    public ref: DynamicDialogRef,
    private primengConfig: PrimeNG,
    private comSrv: ComprasService,
    private cdRef:ChangeDetectorRef,
  ) { }


  CargaRegistroCompras(event: LazyLoadEvent) {


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
      filters: event.filters
    }

    this.comSrv.getComprasTotalRegistros(consulta).subscribe(resTotales => {


      setTimeout(() => {

        let datosPost: any = {
          sort_acti: (event.sortField == undefined) ? 'fecha_compra' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.rows,
          index: event.first,
          filters: event.filters
        }

        this.entityService.ComprasRegistradas(datosPost).subscribe(
          (res) => {

            this.compras = res["data"];
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

  onRowSelect(compra) {
    this.ref.close(compra);
  }


  /*
  ngAfterViewInit(): void {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {

          this.isLoadingResults = true;

          this.resultsLength = parseInt(localStorage.getItem("total_compras"));
          this.busqueda = '';

          let con = {
            "busqueda" : this.busqueda,
            "sort_acti": this.sort.active,
            "sort_direc": this.sort.direction,
            "index": (this.paginator.pageIndex) > 0 ? this.paginator.pageIndex * this.paginator.pageSize : 0,
            "page_size": this.paginator.pageSize,
            "total": (total) => this.resultsLength = total

          }

          return this.entityService.ComprasRegistradas(con);

        }),
        map(data => {

          console.log(data);

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

  }*/

  /*
  CloseModalEvent(event:any){
    this.CloseModalTable.emit(event);
  }
  */

}

// Simulates server-side rendering
/*
class ElementService {
  constructor() { }

  fetchLatest(active: string, direction: string, pageIndex: number, pageSize: number): Observable<ElementResult> {

    active = active || 'position';
    const cmp = (a, b) => (a[active] < b[active] ? -1 : 1);
    const rev = (a, b) => cmp(b, a);
    const [l, r] = [(pageIndex - 1) * pageSize, pageIndex * pageSize];

    const data = [...ELEMENT_DATA]
      .sort(direction === 'desc' ? rev : cmp)
      .filter((_, i) => l <= i && i < r);

    // 1 second delay to simulate network request delay
    return new BehaviorSubject({ resultsLength: ELEMENT_DATA.length, data });//.debounceTime(1000);
  }
}

interface ElementResult {
  resultsLength: number;
  data: PeriodicElement[];
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
*/
