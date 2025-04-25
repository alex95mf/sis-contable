import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CajaChicaComponent} from './caja-chica.component'
import {CajaChicaRoutingModule} from './caja-chica.routing';

@NgModule({
  declarations: [CajaChicaComponent],
  imports: [
    CommonModule,
    CajaChicaRoutingModule
  ]
})
export class CajaChicaModule { }
