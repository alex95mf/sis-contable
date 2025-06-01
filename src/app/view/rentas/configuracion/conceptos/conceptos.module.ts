import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from './conceptos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConceptoFormComponent } from './concepto-form/concepto-form.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ModalMesesInteresComponent } from './modal-meses-interes/modal-meses-interes.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    ConceptosComponent,
    ConceptoFormComponent,
    ModalCuentPreComponent,
    ModalMesesInteresComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ConceptosRoutingModule
  ]
})
export class ConceptosModule { }
