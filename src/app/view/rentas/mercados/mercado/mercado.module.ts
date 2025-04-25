import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MercadoRoutingModule } from './mercado-routing.module';
import { MercadoComponent } from './mercado.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ConceptoFormComponent } from './concepto-form/concepto-form.component';


@NgModule({
  declarations: [
    MercadoComponent,
    ModalCuentPreComponent,
    ConceptoFormComponent
  ],
  imports: [
    CommonModule,
    MercadoRoutingModule,
    AppCustomModule
  ]
})
export class MercadoModule { }
