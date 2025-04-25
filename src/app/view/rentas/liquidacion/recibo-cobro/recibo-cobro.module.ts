import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReciboCobroRoutingModule } from './recibo-cobro-routing.module';
import { ReciboCobroComponent } from './recibo-cobro.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';

@NgModule({
  declarations: [
    ReciboCobroComponent,
    ModalLiquidacionesComponent,
    ListRecDocumentosComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ReciboCobroRoutingModule
  ]
})
export class ReciboCobroModule { }
