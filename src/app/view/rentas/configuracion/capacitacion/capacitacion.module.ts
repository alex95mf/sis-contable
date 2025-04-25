import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapacitacionRoutingModule } from './capacitacion-routing.module';
import { CapacitacionComponent } from './capacitacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    CapacitacionComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CapacitacionRoutingModule
  ]
})
export class CapacitacionModule { }
