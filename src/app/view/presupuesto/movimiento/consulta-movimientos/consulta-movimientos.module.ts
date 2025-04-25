import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaMovimientosComponent } from './consulta-movimientos.component';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConsultaMovimientosRoutingModule } from './consulta-movimientos-routing.module';

import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';

@NgModule({
  declarations: [
    ConsultaMovimientosComponent,ModalCuentPreComponent
  ],
  imports: [
    CommonModule,AppCustomModule,ConsultaMovimientosRoutingModule
  ]
})
export class ConsultaMovimientosModule { }
