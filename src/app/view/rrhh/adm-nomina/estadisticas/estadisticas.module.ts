import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasRoutingModule } from './estadisticas.routing';
import { EstadisticasComponent } from './estadisticas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CalendarModule } from 'primeng/calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    EstadisticasComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CalendarModule,
    NgxChartsModule,
    NgxCurrencyDirective,
    EstadisticasRoutingModule,
  ],
})
export class EstadisticasModule { }
