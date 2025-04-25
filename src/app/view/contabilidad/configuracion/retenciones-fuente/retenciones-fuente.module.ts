import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetencionesFuenteRoutingModule } from './retenciones-fuente-routing.module';
import { RetencionesFuenteComponent } from './retenciones-fuente.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormSaveComponent } from './form-save/form-save.component';


@NgModule({
  declarations: [
    RetencionesFuenteComponent,
    FormSaveComponent
  ],
  imports: [
    CommonModule,
    RetencionesFuenteRoutingModule,
    AppCustomModule,
  ]
})
export class RetencionesFuenteModule { }
