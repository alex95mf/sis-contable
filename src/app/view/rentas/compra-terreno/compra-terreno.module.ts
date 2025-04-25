import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompraTerrenoRoutingModule } from './compra-terreno-routing.module';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';


@NgModule({
  declarations: [
    LiquidacionComponent
  ],
  imports: [
    CommonModule,
    CompraTerrenoRoutingModule
  ]
})
export class CompraTerrenoModule { }
