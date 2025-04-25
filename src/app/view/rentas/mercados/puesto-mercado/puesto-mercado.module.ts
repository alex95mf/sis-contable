import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuestoMercadoRoutingModule } from './puesto-mercado-routing.module';
import { PuestoMercadoComponent } from './puesto-mercado.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { PuestoMercadoFormComponent } from './puesto-mercado-form/puesto-mercado-form.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    PuestoMercadoComponent,
    PuestoMercadoFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    PuestoMercadoRoutingModule
  ],
  providers: [
    ValidacionesFactory,
    ExcelService,
  ]
})
export class PuestoMercadoModule { }
