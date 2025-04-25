import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratoRubrosRoutingModule } from './contrato-rubros.routing';
import { ContratoRubrosComponent } from './contrato-rubros.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    ContratoRubrosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    MatTableModule,
    ContratoRubrosRoutingModule
  ]
})
export class ContratoRubrosModule { }
