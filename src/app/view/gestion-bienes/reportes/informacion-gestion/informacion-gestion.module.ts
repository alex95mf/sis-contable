import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformacionGestionRoutingModule } from './informacion-gestion.routing';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCustomModule,
    InformacionGestionRoutingModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class InformacionGestionModule { }
