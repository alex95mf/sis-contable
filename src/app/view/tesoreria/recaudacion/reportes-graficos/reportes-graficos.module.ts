import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ReportesGraficosRoutingModule } from './reportes-graficos-routing.module';
import { ReportesGraficosComponent } from './reportes-graficos.component';
import { ExcelService } from 'src/app/services/excel.service';
// import { ChartsModule } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ReportesGraficosComponent,

  ],
  imports: [
    CommonModule,
    ReportesGraficosRoutingModule,
    AppCustomModule,
    CalendarModule
  ],
  providers: [
    ExcelService,
    provideCharts(withDefaultRegisterables())
  ]
})
export class ReportesGraficosModule { }
