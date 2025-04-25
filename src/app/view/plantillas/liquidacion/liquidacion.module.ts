import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { LcomercialesRoutingModule } from './liquidacion-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCustomModule,
    LcomercialesRoutingModule
  ]
})
export class LiquidacionModule { }
