import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrucePagosRoutingModule } from './cruce-pagos-routing.module';
import { CrucePagosComponent } from './cruce-pagos.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ListAnticipoPrecobradoComponent } from './list-anticipo-precobrado/list-anticipo-precobrado.component';
import { ListCruceConvenioComponent } from './list-cruce-convenio/list-cruce-convenio.component';
import { ListGarantiasComponent } from './list-garantias/list-garantias.component';
import { ListNotaCreditoComponent } from './list-nota-credito/list-nota-credito.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ListVafavorComponent } from './list-vafavor/list-vafavor.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalFacturasComponent } from './modal-facturas/modal-facturas.component';
import { ModalRecDocumentoComponent } from './modal-rec-documento/modal-rec-documento.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    CrucePagosComponent,
    ConceptoDetComponent,
    ListAnticipoPrecobradoComponent,
    ListCruceConvenioComponent,
    ListGarantiasComponent,
    ListNotaCreditoComponent,
    ListRecDocumentosComponent,
    ListVafavorComponent,
    ModalLiquidacionesComponent,
    ModalFacturasComponent,
    ModalRecDocumentoComponent
  ],
  imports: [
    CommonModule,
    CrucePagosRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class CrucePagosModule { }
