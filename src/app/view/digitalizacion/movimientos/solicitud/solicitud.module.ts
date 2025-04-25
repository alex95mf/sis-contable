import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudRoutingModule } from './solicitud-routing.module';
import { SolicitudComponent } from './solicitud.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component';

import { DetallePrestamoComponent } from './detalle-prestamo/detalle-solicitud.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    SolicitudComponent,
    DetalleSolicitudComponent,
    AnexosListComponentDis,
    DetallePrestamoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    SolicitudRoutingModule,
    CalendarModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class SolicitudModule { }
