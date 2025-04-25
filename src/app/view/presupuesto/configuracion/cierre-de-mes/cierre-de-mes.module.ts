import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreDeMesRoutingModule } from './cierre-de-mes-routing.module';
import { CierreDeMesComponent } from './cierre-de-mes.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    CierreDeMesComponent
  ],
  imports: [
    CommonModule,
    CierreDeMesRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
})
export class CierreDeMesModule { }




