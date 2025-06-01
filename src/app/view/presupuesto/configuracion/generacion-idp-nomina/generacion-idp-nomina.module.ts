import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionIdpNominaRoutingModule } from './generacion-idp-nomina-routing.module';
import { GeneracionIdpNominaComponent } from './generacion-idp-nomina.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalIngresoAsignacionComponent } from './modal-ingreso-asignacion/modal-ingreso-asignacion.component';
import { ModalIcpNominaComponent } from './modal-icp-nomina/modal-icp-nomina.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionIdpNominaComponent,
    ListRecDocumentosComponent,
    ModalIngresoAsignacionComponent,
    ModalIcpNominaComponent
  ],
  imports: [
    CommonModule,
    GeneracionIdpNominaRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class GeneracionIdpNominaModule { }
