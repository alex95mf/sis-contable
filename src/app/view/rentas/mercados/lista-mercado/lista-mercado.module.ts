import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaMercadoRoutingModule } from './lista-mercado-routing.module';
import { ListaMercadoComponent } from './lista-mercado.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ListaMercadoComponent
  ],
  imports: [
    CommonModule,
    ListaMercadoRoutingModule,
    AppCustomModule
  ],providers: [
    ExcelService
  ],
})
export class ListaMercadoModule { }
