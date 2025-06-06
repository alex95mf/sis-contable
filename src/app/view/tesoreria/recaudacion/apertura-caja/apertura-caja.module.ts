import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AperturaCajaRoutingModule } from './apertura-caja-routing.module';
import { AperturaCajaComponent } from './apertura-caja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    AperturaCajaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    AperturaCajaRoutingModule
  ]
})
export class AperturaCajaModule { }
