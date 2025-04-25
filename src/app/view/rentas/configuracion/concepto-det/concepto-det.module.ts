import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptoDetRoutingModule } from './concepto-det-routing.module';
import { ConceptoDetComponent } from './concepto-det.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConceptoDetFormComponent } from './concepto-det-form/concepto-det-form.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { NgxCurrencyModule } from "ngx-currency";


@NgModule({
  declarations: [
    ConceptoDetComponent,
    ConceptoDetFormComponent,
    ModalCuentPreComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ConceptoDetRoutingModule,
    NgxCurrencyModule
  ]
})
export class ConceptoDetModule { }
