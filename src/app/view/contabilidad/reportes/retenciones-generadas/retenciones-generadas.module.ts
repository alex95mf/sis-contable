import { NgModule } from '@angular/core';
import { RetencionesGeneradasComponent } from './retenciones-generadas.component';
import { RetencionesGeneradasRoutingModule } from './retenciones-generadas.rounting';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [RetencionesGeneradasComponent, ],
  imports: [
    RetencionesGeneradasRoutingModule,
    AppCustomModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ]
 
})
export class RetencionesGeneradasModule { }
