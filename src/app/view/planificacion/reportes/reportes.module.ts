import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ReportesRoutingModule } from './reportes-routing.module';
import { PoaComponent } from './poa/poa.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PacComponent } from './pac/pac.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TareasComponent } from './tareas/tareas.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    PoaComponent,
    DashboardComponent,
    PacComponent,
    TareasComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ReportesRoutingModule,
    NgxChartsModule,
    NgxCurrencyModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class ReportesModule { }
