import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentroCostoComponent} from './centro-costo.component';
import {CentroCostoRoutingModule} from './centro-costo.routing';


@NgModule({
  declarations: [CentroCostoComponent],
  imports: [
    CommonModule,
    CentroCostoRoutingModule
  ]
})
export class  CentroCostoModule { }
