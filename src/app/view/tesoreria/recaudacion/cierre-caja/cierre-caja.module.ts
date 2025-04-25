import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreCajaRoutingModule } from './cierre-caja-routing.module';
import { CierreCajaComponent } from './cierre-caja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    CierreCajaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CierreCajaRoutingModule
  ]
})
export class CierreCajaModule { }
