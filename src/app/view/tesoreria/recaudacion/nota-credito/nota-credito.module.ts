import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotaCreditoRoutingModule } from './nota-credito-routing.module';
import { NotaCreditoComponent } from './nota-credito.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    NotaCreditoComponent,
    ListRecDocumentosComponent,
    ModalLiquidacionesComponent,
    ModalInspeccionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    NotaCreditoRoutingModule,
  ]
})
export class NotaCreditoModule { }
