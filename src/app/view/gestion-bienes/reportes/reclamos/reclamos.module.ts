import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamosRoutingModule } from './reclamos.routing';
import { ReclamosComponent } from './reclamos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ReclamosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ReclamosRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ReclamosModule { }
