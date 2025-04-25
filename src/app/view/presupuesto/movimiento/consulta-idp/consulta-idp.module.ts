import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaIdpRoutingModule } from './consulta-idp-routing.module';
import { ConsultaIdpComponent } from './consulta-idp.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalIdpdetallesComponent } from './modal-idpdetalles/modal-idpdetalles.component';
import { ModalEstadoComponent } from './modal-estado/modal-estado.component';


@NgModule({
  declarations: [
    ConsultaIdpComponent,
    ModalIdpdetallesComponent,
    ModalEstadoComponent
  ],
  imports: [
    CommonModule,
    ConsultaIdpRoutingModule,
    AppCustomModule
  ]
})
export class ConsultaIdpModule { }
