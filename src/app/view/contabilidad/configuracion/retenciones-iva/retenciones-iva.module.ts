import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetencionesIvaRoutingModule } from './retenciones-iva-routing.module';
import { RetencionesIvaComponent } from './retenciones-iva.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormSaveComponent } from './form-save/form-save.component';


@NgModule({
  declarations: [
    RetencionesIvaComponent,
    FormSaveComponent
  ],
  imports: [
    CommonModule,
    RetencionesIvaRoutingModule,
    AppCustomModule,
  ]
})
export class RetencionesIvaModule { }
