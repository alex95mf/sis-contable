import { ChangeDetectorRef, Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent, PrimeNGConfig } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { SalaryAditionalI } from "src/app/models/responseSalaryAditional.interfase";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-cc-modal-table-sueldo",
  templateUrl: "./cc-modal-table-sueldo.component.html",
  styleUrls: ["./cc-modal-table-sueldo.component.scss"],
})
export class CcModalTableSueldoComponent {
  dataSueldoResponseI: any;
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

  CargaSueldos(event: LazyLoadEvent) {
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
    //let $filterCargo = event.filters.dep_cargo?.value ?? '';
    let $filterCargo = this.config.data.id_cargo ?? event.filters.dep_cargo?.value
    let $filterAño = event.filters.sld_anio?.value ?? '';
    let $filterCodigoSectorial = event.filters.dep_descripcion?.value ?? '';
    let buscarFilterOption = ($filterAño == '') ? $filterCodigoSectorial : $filterAño ;
    let buscarFilter = Object.entries(event.filters).length === 0 ? '' : buscarFilterOption;

    const p_page = event.first / this.rows + 1;

    let parameterUrl: any = {
      // busqueda: localStorage.getItem("busqueda_cierre"),
      // filters: event.filters,
      // detalle:this.isDetalle
      page: p_page,
      size: this.rows,
      sort: (event.sortField == undefined) ? 'id_sueldo' : event.sortField,
      type_sort: (event.sortOrder == -1) ? 'desc' : 'asc',
      search: buscarInput == '' ? buscarFilter : buscarInput,
      cargo: $filterCargo,
      relation: this.config.data?.relation,
      relation_selected: this.config.data?.relation_selected,
     
    };

    console.log(parameterUrl)

    this.generalService.getSueldosPaginate(parameterUrl).subscribe({
      next: (rpt: SalaryAditionalI) => {
        this.dataSueldoResponseI = rpt.data;
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

  onRowSelectSueldo(sueldo: SalaryAditionalI) {
    //  console.log(sueldo.data);
    this.ref.close(sueldo.data);
  }
}
