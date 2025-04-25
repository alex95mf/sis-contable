import { NgModule } from '@angular/core';
import { LiquidacionesComponent } from './liquidaciones.component';
import { LiquidacionesRoutingModule } from './liquidaciones.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [LiquidacionesComponent],
  imports: [
    LiquidacionesRoutingModule,
    AppCustomModule
  ]
})
export class LiquidacionesModule { }
