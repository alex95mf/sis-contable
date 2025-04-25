import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionValorRoutingModule } from './generacion-valor-routing.module';
import { GeneracionValorComponent } from './generacion-valor.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { NgxCurrencyModule } from "ngx-currency";


@NgModule({
  declarations: [
    GeneracionValorComponent,
    ModalExoneracionesComponent,
    ListLiquidacionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    GeneracionValorRoutingModule
  ]
})
export class GeneracionValorModule { }
