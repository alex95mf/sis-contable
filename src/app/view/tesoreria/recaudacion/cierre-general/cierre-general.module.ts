import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreGeneralRoutingModule } from './cierre-general-routing.module';
import { CierreGeneralComponent } from './cierre-general.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalReporteCajaComponent } from './modal-reporte-caja/modal-reporte-caja.component';


@NgModule({
  declarations: [
    CierreGeneralComponent,
    ModalReporteCajaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CierreGeneralRoutingModule,
    NgxCurrencyDirective
  ]
})
export class CierreGeneralModule { }
