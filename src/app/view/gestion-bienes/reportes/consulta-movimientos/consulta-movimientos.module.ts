import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ConsultaMovimientosRoutingModule } from './consulta-movimientos-routing.module';
import { ConsultaMovimientosComponent } from './consulta-movimientos.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ConsultaMovimientosComponent
  ],
  imports: [
    CommonModule,
    ConsultaMovimientosRoutingModule,
    AppCustomModule
    
  ],
  providers: [
    ExcelService
  ]
})
export class ConsultaMovimientosModule { }
