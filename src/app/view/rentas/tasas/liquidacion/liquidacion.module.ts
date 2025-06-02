import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidacionRoutingModule } from './liquidacion-routing.module';
import { LiquidacionComponent } from './liquidacion.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalTasasComponent } from './modal-tasas/modal-tasas.component';
import { NgxCurrencyDirective } from "ngx-currency";


@NgModule({
  declarations: [
    LiquidacionComponent,
    ListLiquidacionesComponent,
    ModalConceptosComponent,
    ModalExoneracionesComponent,
    ModalInspeccionesComponent,
    ModalTasasComponent
  ],
  imports: [
    CommonModule,
    LiquidacionRoutingModule,
    AppCustomModule,
    NgxCurrencyDirective
  ]
})
export class LiquidacionModule { }
