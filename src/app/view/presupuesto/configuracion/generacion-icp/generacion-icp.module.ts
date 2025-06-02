import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionIcpRoutingModule } from './generacion-icp-routing.module';
import { GeneracionIcpComponent } from './generacion-icp.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalIngresoAsignacionComponent } from './modal-ingreso-asignacion/modal-ingreso-asignacion.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionIcpComponent,
    ListRecDocumentosComponent,
    ModalIngresoAsignacionComponent,
    ModalSolicitudComponent
  ],
  imports: [
    CommonModule,
    GeneracionIcpRoutingModule,
    AppCustomModule,
    NgxCurrencyDirective
  ]
})
export class GeneracionIcpModule { }
