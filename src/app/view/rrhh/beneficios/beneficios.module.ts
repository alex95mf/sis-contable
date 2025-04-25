import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiosRoutingModule } from './beneficios.routing';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    BeneficiosRoutingModule
  ]
})
export class BeneficiosModule { }
