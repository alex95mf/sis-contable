import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReglaPresupuestariaRoutingModule } from './regla-presupuestaria-routing.module';
import { ReglaPresupuestariaComponent } from './regla-presupuestaria.component';
import {SueldoNuevoComponent } from './grupo-nuevo/sueldo-nuevo.component'
import {ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component'
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    ReglaPresupuestariaComponent,SueldoNuevoComponent,ModalCuentPreComponent
  ],
  imports: [
    CommonModule,
    ReglaPresupuestariaRoutingModule,AppCustomModule
  ]
})
export class ReglaPresupuestariaModule { }
