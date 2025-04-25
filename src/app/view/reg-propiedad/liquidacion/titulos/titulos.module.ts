import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitulosComponent } from './titulos.component';
import { TitulosRoutingModule } from './titulos-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    TitulosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TitulosRoutingModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class TitulosModule { }
