import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { GeneracionRoutingModule } from './generacion-routing.module';
import { GeneracionComponent } from './generacion.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionComponent,
    ListLiquidacionesComponent,
    ModalDetallesComponent,
    ModalContribuyentesComponent,
    ModalLiquidacionesComponent,
    ModalExoneracionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    GeneracionRoutingModule
  ]
})
export class GeneracionModule { }
