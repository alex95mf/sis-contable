import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent, PrimeNGConfig } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { DepartamentoResponseI } from "src/app/models/responseDepartamento.interface";
import { DepartemtAditionalI } from "src/app/models/responseDepartemtAditional.interface";
import { GeneralService } from "src/app/services/general.service";
import { CustonService } from "../../app-custom.service";

@Component({
  selector: "app-cc-modal-table-departamento",
  templateUrl: "./cc-modal-table-departamento.component.html",
  styleUrls: ["./cc-modal-table-departamento.component.scss"],
  // template: `
  //   <p-table
  //     [value]="cuentas"
  //     [lazy]="true"
  //     (onLazyLoad)="CargaCuentas($event)"
  //     selectionMode="single"
  //     [(selection)]="selectedProduct2"
  //     (onRowSelect)="onRowSelectCuenta($event)"
  //     responsiveLayout="scroll"
  //     [paginator]="true"
  //     [rows]="10"
  //     [totalRecords]="totalRecords"
  //     [loading]="loading"
  //     [showCurrentPageReport]="true"
  //     currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
  //     [rowsPerPageOptions]="[10, 25, 50]"
  //   >
  //     <ng-template pTemplate="header">
  //       <tr>
  //         <th pSortableColumn="codigo">
  //           Codigo <p-sortIcon field="codigo"></p-sortIcon>
  //         </th>
  //         <th pSortableColumn="nombre">
  //           Nombre <p-sortIcon field="nombre"></p-sortIcon>
  //         </th>
  //         <th pSortableColumn="grupo">
  //           Grupo <p-sortIcon field="grupo"></p-sortIcon>
  //         </th>
  //       </tr>
  //       <tr>
  //         <th>
  //           <p-columnFilter type="text" field="codigo"></p-columnFilter>
  //         </th>
  //         <th>
  //           <p-columnFilter type="text" field="nombre"></p-columnFilter>
  //         </th>
  //         <th>
  //           <p-columnFilter type="text" field="grupo"></p-columnFilter>
  //         </th>
  //       </tr>
  //     </ng-template>
  //     <ng-template pTemplate="body" let-cuenta>
  //       <tr [pSelectableRow]="cuenta">
  //         <td>{{ cuenta.codigo }}</td>
  //         <td>{{ cuenta.nombre }}</td>
  //         <td>{{ cuenta.grupo }}</td>
  //       </tr>
  //     </ng-template>
  //   </p-table>
  // `,
})
export class CcModalTableDepartamentoComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  /////////
  dataDepartamentoResponseI: any
  departament : any;
  // dataDepartamentoResponseI: DepartamentoResponseI = {
  //   id_departamento: 0,
  //   dep_nombre: "",
  //   dep_descripcion: "",
  //   dep_keyword: "",
  //   id_area: 0,
  //   estado_id: 0,
  //   catalogo: undefined,
  //   area: undefined,
  // };
  /////////

  cuentas: any;
  totalRecords: number;
  rows: number;

  loading: boolean;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  isDetalle = false;
  busqueda = "";

  @Output() EventElemntRow = new EventEmitter();

  constructor(
    //private entityService: PlanCuentasService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private entityService: CustonService,
    private generalService: GeneralService,
    private primengConfig: PrimeNGConfig,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  CargaDepartamentos(event: LazyLoadEvent) {
    this.rows = 10;
    this.loading = true;
    this.primengConfig.setTranslation({
      startsWith: "Comienza con",
      contains: "Contiene",
      notContains: "No contiene",
      endsWith: "Termina en",
      equals: "Igual",
      notEquals: "No igual",
      noFilter: "Sin filtro",
    });


    this.isDetalle = localStorage.getItem("detalle_consulta") === "true";

    let buscarInput =  this.config.data.search??'';
    let $filterDescripción = event.filters.dep_nombre?.value ?? '';
    let $filterNombre = event.filters.dep_descripcion?.value ?? '';
    let buscarFilterOption = ($filterDescripción == '') ? $filterNombre : $filterDescripción ;
    let buscarFilter = Object.entries(event.filters).length === 0 ? '' : buscarFilterOption;

    const p_page = event.first / this.rows + 1;
    let parameterUrl: any = {
      // busqueda: localStorage.getItem("busqueda_cierre"),
      // filters: event.filters,
      // detalle:this.isDetalle
      page: p_page,
      size: this.rows,
      sort: (event.sortField == undefined) ? 'id_departamento' : event.sortField,
      type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
      search: buscarInput == '' ? buscarFilter : buscarInput,
      relation: this.config.data?.relation,
      relation_selected: this.config.data?.relation_selected,
      // search: this.config.data?.search,
    };

    console.log(parameterUrl);
    // this.generalService.getPeriodos(parameterUrl).subscribe(resTotales => {
    this.generalService.getPeriodosPaginate(parameterUrl).subscribe({
      next: (rpt: DepartemtAditionalI) => {
        this.dataDepartamentoResponseI = rpt.data;
        // console.log(rpt.data);
        // this.rows = 2;
        this.totalRecords = rpt.total;

        this.loading = false;

        // setTimeout(() => {
        //   this.dtTrigger.next();
        // }, 50);
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loading = false;
      },
    });

    /*   setTimeout(() => {

        

        let datosPost: any = {

          busqueda: localStorage.getItem("busqueda_cierre"),
          sort_acti: (event.sortField == undefined) ? 'id' : event.sortField,
          sort_direc: (event.sortOrder == -1) ? 'desc' : 'asc',
          page_size: event.first,
          index: event.first + event.rows,
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

      }, 1000); */

    // }, error => {

    // })
  }

  onRowSelectDepartamento(departament:DepartemtAditionalI) {
    
    //  console.log(departament.data);
    this.ref.close(departament.data);
  }
}
