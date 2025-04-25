import { NgModule } from '@angular/core';
import { EstadoResultadoComponent } from './estado-resultado.component';
import {EstadoResultadoRoutingModule} from './estado-resultado.routing';
import { ExcelService } from '../../../../services/excel.service';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [EstadoResultadoComponent],
  imports: [
    EstadoResultadoRoutingModule,
    AppCustomModule,
    CalendarModule
  ],providers: [
    ExcelService
  ]
})
export class EstadoResultadoModule { }
