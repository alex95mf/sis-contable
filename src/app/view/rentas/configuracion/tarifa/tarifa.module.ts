import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { TarifaRoutingModule } from './tarifa-routing.module';
import { TarifaComponent } from './tarifa.component';
import { ListTarifaComponent } from './list-tarifa/list-tarifa.component';
import { ModalTarifasComponent } from './modal-tarifas/modal-tarifas.component';
import { NgxCurrencyModule } from "ngx-currency";


@NgModule({
  declarations: [
    TarifaComponent,
    ListTarifaComponent,
    ModalTarifasComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TarifaRoutingModule,
    NgxCurrencyModule
  ]
})
export class TarifaModule { }
