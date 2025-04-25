import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FlujoEfectivoRoutingModule } from './formulario-ciento-tres-routing.module';
import { FormularioCientoTresComponent } from './formulario-ciento-tres.component'; 

import { ExcelService } from 'src/app/services/excel.service';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    FormularioCientoTresComponent,
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
export class FormularioCientoTresModule { }
