import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { TablaAmortizacionRoutingModule } from './tabla-amortizacion-rounting.module';
import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    ComponentModalBusquedaComponent,
  ],
  imports: [
    CommonModule,
    TablaAmortizacionRoutingModule,
    AppCustomModule,
    NgxCurrencyModule

  ]
})
export class TablaAmortizacionModule { }
