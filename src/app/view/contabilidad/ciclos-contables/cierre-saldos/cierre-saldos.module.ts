import { NgModule } from '@angular/core';
import { CierreSaldosComponent } from './cierre-saldos.component'; 
import { CierreDeSaldosRoutingModule } from './cierre-saldo.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [CierreSaldosComponent, ],
  imports: [
    CierreDeSaldosRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
 
})
export class CierreSaldosModule { }
