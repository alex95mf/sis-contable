import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CobranzasRoutingModule} from './cobranza.routing';
import { GestioncobroComponent } from './gestioncobro/gestioncobro.component';

@NgModule({
  declarations: [
    GestioncobroComponent
  ],
  imports: [
    CommonModule,
    CobranzasRoutingModule
  ]
})
export class CobranzasModule { }
