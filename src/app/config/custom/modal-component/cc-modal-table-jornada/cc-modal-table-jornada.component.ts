import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent, PrimeNGConfig } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WorkdayAditionalI } from 'src/app/models/responseWorkdayAditional.interfase';
import { GeneralService } from 'src/app/services/general.service';

@Component({
standalone: false,
  selector: "app-cc-modal-table-jornada",
  templateUrl: "./cc-modal-table-jornada.component.html",
  styleUrls: ["./cc-modal-table-jornada.component.scss"],
})
export class CcModalTableJornadaComponent implements AfterViewChecked {
  dataJornadaResponseI: any;
  // jornada : any;
  loading: boolean;
  totalRecords: number;
  rows: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    public config: DynamicDialogConfig,
    private primengConfig: PrimeNGConfig,
    public ref: DynamicDialogRef,
    private generalService: GeneralService,
    private toastr: ToastrService
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {}

  CargaJornadas(event: LazyLoadEvent) {
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

    // this.isDetalle = localStorage.getItem("detalle_consulta") === "true";
    let buscarInput =  this.config.data.search??'';
    let $filterDescripción = event.filters.jnd_tipo_jornada?.value ?? '';
    let $filterAlmuerza = event.filters.dep_descripcion?.value ?? '';
    let buscarFilterOption = ($filterDescripción == '') ? $filterAlmuerza : $filterDescripción ;
    let buscarFilter = Object.entries(event.filters).length === 0 ? '' : buscarFilterOption;

    const p_page = event.first / this.rows + 1;
    let parameterUrl: any = {
      // busqueda: localStorage.getItem("busqueda_cierre"),
      // filters: event.filters,
      // detalle:this.isDetalle
      page: p_page,
      size: this.rows,
      sort: (event.sortField == undefined) ? 'id_jornada' : event.sortField,
      type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
      search: buscarInput == '' ? buscarFilter : buscarInput,
      relation: this.config.data?.relation,
      relation_selected: this.config.data?.relation_selected,
    };

    this.generalService.getJornadasPaginate(parameterUrl).subscribe({
      next: (rpt: WorkdayAditionalI) => {
        this.dataJornadaResponseI = rpt.data;
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

  onRowSelectJornada(jornada: WorkdayAditionalI) {
    //  console.log(jornada.data);
    this.ref.close(jornada.data);
  }
}
