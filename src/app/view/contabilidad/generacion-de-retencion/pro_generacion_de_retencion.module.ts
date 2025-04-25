import { NgModule } from '@angular/core';
import { GeneracionDeRetencionComponent } from './generacion-de-retencion.component';
import { ProGeneracionRetencionRoutingModule } from './pro_generacion_de_retencion.routing';
import { AppCustomModule } from '../../../config/custom/app-custom.module';

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [GeneracionDeRetencionComponent],
  imports: [
    ProGeneracionRetencionRoutingModule,
    AppCustomModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    CalendarModule,
  ]
 
})
export class GeneracionRetencionModule { }