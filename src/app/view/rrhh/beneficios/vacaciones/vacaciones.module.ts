import { NgModule } from '@angular/core';
import { VacacionesComponent } from './vacaciones.component';
import {VacacionesRoutingModule} from './vacaciones.routing'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [VacacionesComponent],
  imports: [
    AppCustomModule,
    VacacionesRoutingModule,
    CalendarModule,
    TableModule
  ]
})
export class VacacionesModule { }
