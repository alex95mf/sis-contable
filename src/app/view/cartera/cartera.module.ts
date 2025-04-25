import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteraComponent } from './cartera.component';
import { CarteraRoutingModule } from './cartera.routing';


@NgModule({
  declarations: [CarteraComponent],
  imports: [
    CommonModule,
    CarteraRoutingModule
  ]
})
export class CarteraModule { }
