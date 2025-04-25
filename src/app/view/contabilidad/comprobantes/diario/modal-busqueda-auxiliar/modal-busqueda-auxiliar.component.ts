import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LazyLoadEvent, PrimeNGConfig } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustonService } from 'src/app/config/custom/app-custom.service';

@Component({
  selector: 'app-modal-busqueda-auxiliar',
  templateUrl: './modal-busqueda-auxiliar.component.html',
  styleUrls: ['./modal-busqueda-auxiliar.component.scss']
})
export class ModalBusquedaAuxiliarComponent implements AfterViewChecked {
  loading: boolean;

  cuentas: Array<any> = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private entityService: CustonService,
    private primengConfig: PrimeNGConfig,
    private cdRef:ChangeDetectorRef,
  ) { }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
  }

  async getCuentas(event: LazyLoadEvent) {
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

    // Object.assign(event.filters, { tipo: this.config.data.cod })

    let consulta = {
      filters: event.filters,
      params: {
        filter: {
          referencia: this.config.data.cod
        }
      }
    }

    try {
      let cuentas = await this.entityService.obtenerCuentasAuxiliar(consulta);
      console.log(cuentas)
      this.cuentas = cuentas

      this.loading = false
    } catch (err) {
      this.loading = false
    }


  }

  onRowSelectCuenta(cuenta: any) {
    this.ref.close(cuenta);
  }

}
