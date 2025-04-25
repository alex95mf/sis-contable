import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FlujoEfectivoRoutingModule } from './flujo-efectivo-routing.module';
import { FlujoEfectivoComponent } from './flujo-efectivo.component'; 

import { ExcelService } from 'src/app/services/excel.service';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    FlujoEfectivoComponent,
  ],
  imports: [
    CommonModule,
    FlujoEfectivoRoutingModule,
    AppCustomModule,
    CalendarModule
  ],
  providers: [
    ExcelService
  ]
})
export class FlujoEfectivoModule { }
