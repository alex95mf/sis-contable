import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablaCuantiaRoutingModule } from './tabla-cuantia-routing.module';
import { TablaCuantiaComponent } from './tabla-cuantia.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { TablaCuantiaFormComponent } from './tabla-cuantia-form/tabla-cuantia-form.component';


@NgModule({
  declarations: [
    TablaCuantiaComponent,
    TablaCuantiaFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TablaCuantiaRoutingModule
  ]
})
export class TablaCuantiaModule { }
