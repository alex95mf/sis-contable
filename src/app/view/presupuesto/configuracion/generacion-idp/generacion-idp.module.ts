import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionIdpRoutingModule } from './generacion-idp-routing.module';
import { GeneracionIdpComponent } from './generacion-idp.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalIngresoAsignacionComponent } from './modal-ingreso-asignacion/modal-ingreso-asignacion.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionIdpComponent,
    ListRecDocumentosComponent,
    ModalIngresoAsignacionComponent,
    ModalSolicitudComponent
  ],
  imports: [
    CommonModule,
    GeneracionIdpRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class GeneracionIdpModule { }
