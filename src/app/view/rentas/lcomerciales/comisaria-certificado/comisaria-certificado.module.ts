import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ComisariaCertificadoRoutingModule } from './comisaria-certificado-routing.module';
import { ComisariaCertificadoComponent } from './comisaria-certificado.component';


@NgModule({
  declarations: [
    ComisariaCertificadoComponent
  ],
  imports: [
    CommonModule,
    ComisariaCertificadoRoutingModule,
    AppCustomModule
  ]
})
export class ComisariaCertificadoModule { }
