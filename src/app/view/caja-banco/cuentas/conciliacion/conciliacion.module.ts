import { NgModule } from '@angular/core';
import {ConciliacionComponent} from './conciliacion.component';
import {ConciliacionRoutingModule} from './conciliacion.routing';
import { ReportesConComponent } from './reportes-con/reportes-con.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

//import {TableModule} from 'primeng/table';
import { TableModule } from 'primeng/table'

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MovimientoBancarioFormComponent } from './movimiento-bancario-form/movimiento-bancario-form.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';




@NgModule({
  declarations: [ConciliacionComponent, ReportesConComponent, MovimientoBancarioFormComponent,DetalleConciliacionComponent],
  imports: [
    ConciliacionRoutingModule,
    AppCustomModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    CalendarModule,
    InputNumberModule,
    NgxCurrencyDirective,
  ]
})
export class ConciliacionModule { }
