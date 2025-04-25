import { NgModule } from '@angular/core';
import { CierreDeImpuestosComponent } from './cierre-de-impuestos.component'; 
import { CierreDeImpuestosRoutingModule } from './cierre-de-impuestos.routing'; 
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [CierreDeImpuestosComponent, ],
  imports: [
    CierreDeImpuestosRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
 
})
export class CierreDeImpuestosModule { }
