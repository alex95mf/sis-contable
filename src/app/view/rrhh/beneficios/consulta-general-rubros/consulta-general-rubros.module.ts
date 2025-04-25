import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaGeneralRubrosRoutingModule } from './consulta-general-rubros.routing';
import { ConsultaGeneralRubrosComponent } from './consulta-general-rubros.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ConsultaGeneralRubrosComponent
  ],
  imports: [
    AppCustomModule,
    CommonModule,
    NgxCurrencyModule,
    CalendarModule,
    ConsultaGeneralRubrosRoutingModule
  ]
})
export class ConsultaGeneralRubrosModule { }
