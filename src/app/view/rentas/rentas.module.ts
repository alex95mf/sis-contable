import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RentasRoutingModule} from './rentas.routing';
import { PlusvaliasComponent } from './plusvalias/plusvalias.component';
import { LiquidacionComponent } from './plusvalias/liquidacion/liquidacion.component';



@NgModule({
  declarations: [
    
  
    PlusvaliasComponent,
//LiquidacionComponent
  ],
  imports: [
    CommonModule,
    RentasRoutingModule
  ]
})
export class RentasModule { }
