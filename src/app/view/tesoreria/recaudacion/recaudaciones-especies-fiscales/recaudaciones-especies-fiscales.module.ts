import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecaudacionesEspeciesFiscalesRoutingModule } from './recaudaciones-especies-fiscales-routing.module';
import { RecaudacionesEspeciesFiscalesComponent } from './recaudaciones-especies-fiscales.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ListVafavorComponent } from './list-vafavor/list-vafavor.component';
import { ListNotaCreditoComponent } from './list-nota-credito/list-nota-credito.component';
import { ListCruceConvenioComponent } from './list-cruce-convenio/list-cruce-convenio.component';
import { ListAnticipoPrecobradoComponent } from './list-anticipo-precobrado/list-anticipo-precobrado.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    RecaudacionesEspeciesFiscalesComponent,
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
    NgxCurrencyDirective,
    RecaudacionesEspeciesFiscalesRoutingModule,
  ]
})
export class RecaudacionesEspeciesFiscalesModule { }
