import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComparativoRoutingModule } from './comparativo.routing';
import { ComparativoComponent } from './comparativo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ComparativoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    CalendarModule,
    ComparativoRoutingModule
  ]
})
export class ComparativoModule { }
