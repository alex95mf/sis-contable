import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlusvaliasRoutingModule } from './plusvalias-routing.module';
// import { PlusvaliasComponent } from './plusvalias.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListLiquidacionesComponent } from './liquidacion/list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './liquidacion/modal-exoneraciones/modal-exoneraciones.component';
import { GeneracionComponent } from '../liquidacion/generacion/generacion.component';
import { ModalContribuyentesComponent } from '../pred-urbano/generacion/modal-contribuyentes/modal-contribuyentes.component';
import { ModalContribuyentesCompradorComponent } from './liquidacion/modal-contribuyentes-comprador/modal-contribuyentes-comprador.component';
import { ModalExoneracionesAlComponent } from './liquidacion/modal-exoneraciones-al/modal-exoneraciones-al.component';

import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  declarations: [
    LiquidacionComponent,
    ListLiquidacionesComponent,
    ModalContribuyentesComponent,
    ModalExoneracionesComponent,
    GeneracionComponent,
    ModalContribuyentesCompradorComponent,
    ModalExoneracionesAlComponent
  
    
  ],
  imports: [
    CommonModule,
    PlusvaliasRoutingModule,
    AppCustomModule,
    NgxCurrencyModule,
  ]
})
export class PlusvaliasModule { }
