import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ReportesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
})
export class ReportesModule { }
