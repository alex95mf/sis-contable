import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignacionIngresosRoutingModule } from './asignacion-ingresos-routing.module';
import { AsignacionIngresosComponent } from './asignacion-ingresos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    AsignacionIngresosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AsignacionIngresosRoutingModule
  ]
})
export class AsignacionIngresosModule { }
