import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoCuentaProveedorRoutingModule } from './estado-cuenta-proveedor-routing.module';
import { EstadoCuentaProveedorComponent } from './estado-cuenta-proveedor.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';
import {TableModule} from 'primeng/table';
@NgModule({
  declarations: [
    EstadoCuentaProveedorComponent
  ],
  imports: [
    CommonModule,
    EstadoCuentaProveedorRoutingModule,
    AppCustomModule,
    CalendarModule,
    TableModule
  ]
})
export class EstadoCuentaProveedorModule { }
