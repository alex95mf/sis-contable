import { AfterViewChecked, ChangeDetectorRef, Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PrimeNG } from "primeng/config";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { EmployeesAditionalI } from "src/app/models/responseEmployeesAditional.interface";
import { RubroAditionalResponseI } from "src/app/models/responseRubroAditional.interface";
import { GeneralService } from "src/app/services/general.service";

@Component({
standalone: false,
  selector: "app-cc-modal-table-rubro",
  templateUrl: "./cc-modal-table-rubro.component.html",
  styleUrls: ["./cc-modal-table-rubro.component.scss"],
})
export class CcModalTableRubroComponent implements AfterViewChecked {
  totalRecords: number;
  dataRubroResponseI: any;
  rows: number;
  loading: boolean;

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private cdRef: ChangeDetectorRef,
    private primengConfig: PrimeNG,
    private generalService: GeneralService,
    private toastr: ToastrService
  ) {}

  CargaRubro(event: LazyLoadEvent) {
    this.rows = 5;
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

    let parameterUrl: any = {
      page: event.first / this.rows + 1,
      size: this.rows,
      sort: event.sortField == undefined ? "id_rubro" : event.sortField,
      type_sort: event.sortOrder == -1 ? "desc" : "asc",
      search: "",
      relation: this.config.data?.relation,
      tipo_rubro_id: this.config.data?.tipo_rubro_id,
    };

    this.generalService.getRubrosPaginate(parameterUrl).subscribe({
      next: (rpt: RubroAditionalResponseI) => {
        this.dataRubroResponseI = rpt.data;

        this.totalRecords = rpt.total;

        this.loading = false;
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loading = false;
      },
    });
  }

  onRowSelectRubro(empleado: EmployeesAditionalI) {
    //  console.log(empleado.data);
    this.ref.close(empleado.data);
  }
}
