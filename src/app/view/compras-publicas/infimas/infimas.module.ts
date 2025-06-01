import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { InfimasRoutingModule } from './infimas.routing';
import { InfimasComponent } from './infimas.component';
import { DetalleInfimasComponent } from './detalle-infimas/detalle-infimas.component';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    InfimasComponent,
    DetalleInfimasComponent,
    AnexosListComponentDis
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    InfimasRoutingModule,
    CalendarModule,
    NgxCurrencyModule
  ]
})
export class InfimasModule { }
