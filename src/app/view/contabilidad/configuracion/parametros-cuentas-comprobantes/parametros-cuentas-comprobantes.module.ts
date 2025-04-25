import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosCuentasComprobantesRoutingModule } from './parametros-cuentas-comprobantes-routing.module';
import { ParametrosCuentasComprobantesComponent } from './parametros-cuentas-comprobantes.component'; 
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormSaveComponent } from './form-save/form-save.component';


@NgModule({
  declarations: [
    ParametrosCuentasComprobantesComponent,
    FormSaveComponent
  ],
  imports: [
    CommonModule,
    ParametrosCuentasComprobantesRoutingModule,
    AppCustomModule,
  ]
})
export class ParametrosCuentasComprobantesModule { }
