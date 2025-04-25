import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';

import { FormularioConceptosRoutingModule } from './formulario-conceptos-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    FormularioConceptosRoutingModule,
    AppCustomModule,
  ]
})
export class FormularioConceptosModule { }
