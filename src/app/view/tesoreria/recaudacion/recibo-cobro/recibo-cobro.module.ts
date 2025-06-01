import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReciboCobroRoutingModule } from './recibo-cobro-routing.module';
import { ReciboCobroComponent } from './recibo-cobro.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ListGarantiasComponent } from './list-garantias/list-garantias.component';
import { ListVafavorComponent } from './list-vafavor/list-vafavor.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ListCruceConvenioComponent } from './list-cruce-convenio/list-cruce-convenio.component';
import { ListNotaCreditoComponent } from './list-nota-credito/list-nota-credito.component';
import { ListAnticipoPrecobradoComponent } from './list-anticipo-precobrado/list-anticipo-precobrado.component';
// import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    ReciboCobroComponent,
    ModalLiquidacionesComponent,
    ListRecDocumentosComponent,
    ListGarantiasComponent,
    ListVafavorComponent,
    ConceptoDetComponent,
    ListCruceConvenioComponent,
    ListNotaCreditoComponent,
    ListAnticipoPrecobradoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    // NgxCurrencyDirective,
    NgxCurrencyDirective,
    ReciboCobroRoutingModule
  ]
})
export class ReciboCobroModule { }
