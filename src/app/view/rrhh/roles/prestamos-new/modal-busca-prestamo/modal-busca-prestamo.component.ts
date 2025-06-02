import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrestamosService } from '../prestamos.service';

@Component({
standalone: false,
  selector: 'app-modal-busca-prestamo',
  templateUrl: './modal-busca-prestamo.component.html',
  styleUrls: ['./modal-busca-prestamo.component.scss']
})
export class ModalBuscaPrestamoComponent implements AfterViewChecked {
  dataPrestamosResponseI: any
  prestamo: any;
  loading: boolean;
  totalRecords: number;
  rows: number;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private cdRef: ChangeDetectorRef,
    private primengConfig: PrimeNG,
    private toastr: ToastrService,
    private apiService: PrestamosService,
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async getPrestamos(event: LazyLoadEvent) {
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
    // console.log(event.filters);
    // console.log( this.config.data.search );

    let buscarInput =  this.config.data.search ?? '';
    // let $filterIdentificacion = event.filters.emp_identificacion?.value ?? '';
    let $filterNombre = event.filters?.emp_full_nombre?.value ?? '';
    // let buscarFilterOption = ($filterIdentificacion == '') ? $filterNombre : $filterIdentificacion ;
    // let buscarFilter = Object.entries(event.filters).length === 0 ? '' : buscarFilterOption;
    let buscarFilter = Object.entries(event.filters).length === 0 ? '' : $filterNombre;
    let parameterUrl: any = {
      paginate: 1,  // 0: todos, 1: paginado
      page:  p_page,
      size:  this.rows,
      sort: (event.sortField == undefined) ? 'id_prestamo' : event.sortField,
      type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
      search: buscarInput == '' ? buscarFilter : buscarInput,
      relation: this.config.data?.relation,
      relation_selected: this.config.data?.relation_selected,
    };

    try {
      let response: any = await this.apiService.getPrestamos(parameterUrl);
      console.log(response)
      this.dataPrestamosResponseI = response.data
      this.totalRecords = response.total;
      this.loading = false;
    } catch (err) {
      console.log(err);
      this.loading = false;
      this.toastr.error(err.error.detail, 'Error cargando Prestamos');
    }
  }

  onRowSelectPrestamo(prestamo: any) {
    this.ref.close(prestamo.data)
  }

}
