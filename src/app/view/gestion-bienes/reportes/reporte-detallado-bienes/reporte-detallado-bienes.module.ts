import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteDetalladoBienesRoutingModule } from './reporte-detallado-bienes-routing.module';
import { ExcelService } from 'src/app/services/excel.service';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    ReporteDetalladoBienesRoutingModule,
    CalendarModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ReporteDetalladoBienesModule { }
