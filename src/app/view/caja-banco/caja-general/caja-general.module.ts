import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CajaGeneralComponent} from './caja-general.component'
import {CajaRoutingModule} from './caja-general.routing';


@NgModule({
  declarations: [CajaGeneralComponent],
  imports: [
    CommonModule,
    CajaRoutingModule
  ]
})
export class CajaGeneralModule { }
