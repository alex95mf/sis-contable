import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { MultasRoutingModule } from './multas-routing.module';
import { MultasComponent } from './multas.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { ModalLocalesComponent } from './modal-locales/modal-locales.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { NgxCurrencyDirective } from "ngx-currency";

@NgModule({
  declarations: [
    MultasComponent,
    ListLiquidacionesComponent,
    ModalContribuyentesComponent,
    ModalInspeccionesComponent,
    ModalConceptosComponent,
    ModalLocalesComponent,
    ModalExoneracionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    MultasRoutingModule
  ]
})
export class MultasModule { }
