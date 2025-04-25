import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ReportesComponent } from './reportes.component';



import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [

   
    ReportesComponent,

  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ReportesModule { }
