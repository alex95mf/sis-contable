import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeesAditionalI } from 'src/app/models/responseEmployeesAditional.interface';
import { GeneralService } from 'src/app/services/general.service';

@Component({
standalone: false,
  selector: 'app-cc-modal-table-empleado',
  templateUrl: './cc-modal-table-empleado.component.html',
  styleUrls: ['./cc-modal-table-empleado.component.scss']
})
export class CcModalTableEmpleadoComponent implements AfterViewChecked{

  dataEmpleadoResponseI: any
  empleado : any;
  loading: boolean;
  totalRecords: number;
  rows: number;

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private cdRef: ChangeDetectorRef,
    private primengConfig: PrimeNG,
    private generalService: GeneralService,
    private toastr: ToastrService,

  ) {}

  ngOnInit(): void {}

  CargaEmpleado(event: LazyLoadEvent) {

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

    // console.log( this.config.data.relation);
    // this.isDetalle = localStorage.getItem("detalle_consulta") === "true";

    const p_page = event.first / this.rows + 1;
    // console.log(JSON.stringify(event.filters));
    console.log(event.filters);
    // console.log( this.config.data.search );

    let buscarInput =  this.config.data.search ?? '';
    let $filterIdentificacion = event.filters.emp_identificacion?.value ?? '';
    let $filterNombre = event.filters.emp_full_nombre?.value ?? '';
    let $filterEstado = event.filters.estado?.value == 'ACTIVO' ? 'A' : (event.filters.estado?.value == 'INACTIVO' ? 'I' : '');
    let buscarFilterOption = ($filterIdentificacion != '') ? $filterIdentificacion  : (($filterNombre != '') ? $filterNombre : $filterEstado)  ;
    let buscarFilter = Object.entries(event.filters).length === 0 ? '' : buscarFilterOption;
    let parameterUrl: any = {
      // busqueda: localStorage.getItem("busqueda_cierre"),
      // filters: event.filters,
      // detalle:this.isDetalle



      page:  p_page,
      size:  this.rows,//event.rows,
      sort: (event.sortField == undefined) ? 'id_empleado' : event.sortField,
      type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
      // search: (JSON.stringify(event.filters)) === '{}' ? null : JSON.stringify(event.filters),
      search: buscarInput == '' ? buscarFilter : buscarInput,
      relation: this.config.data?.relation,
      relation_selected: this.config.data?.relation_selected,
    };


    // console.log(parameterUrl);
    // this.generalService.getPeriodos(parameterUrl).subscribe(resTotales => {
    this.generalService.getEmpleadosPaginate(parameterUrl).subscribe({
      next: (rpt: EmployeesAditionalI) => {
        this.dataEmpleadoResponseI = rpt.data;
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

  }

  onRowSelectEmpleado(empleado:EmployeesAditionalI) {

  //  console.log(empleado.data);
    this.ref.close(empleado.data);
  }



 public handlePagination(paginationData): void {
  // this.currentPage = paginationData.page + 1;
  // this.filterProducts();
}

}
