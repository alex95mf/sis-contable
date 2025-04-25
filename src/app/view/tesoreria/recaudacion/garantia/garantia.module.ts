import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GarantiaRoutingModule } from './garantia-routing.module';
import { GarantiaComponent } from './garantia.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ListVafavorComponent } from './list-vafavor/list-vafavor.component';
import { ListNotaCreditoComponent } from './list-nota-credito/list-nota-credito.component';
import { ListCruceConvenioComponent } from './list-cruce-convenio/list-cruce-convenio.component';
import { ListAnticipoPrecobradoComponent } from './list-anticipo-precobrado/list-anticipo-precobrado.component';

@NgModule({
  declarations: [
    GarantiaComponent,
    ModalLiquidacionesComponent,
    ListRecDocumentosComponent,
    ModalInspeccionesComponent,
    ListVafavorComponent,
    ListNotaCreditoComponent,
    ListCruceConvenioComponent,
    ListAnticipoPrecobradoComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    GarantiaRoutingModule,
    NgxCurrencyModule,
  ]
})
export class GarantiaModule { }
