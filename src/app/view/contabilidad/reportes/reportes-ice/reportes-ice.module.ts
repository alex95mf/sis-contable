import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesIceRoutingModule } from './reportes-ice-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ReportesIceComponent } from './reportes-ice.component';



import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [

   
    ReportesIceComponent,

  ],
  imports: [
    CommonModule,
    ReportesIceRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ReportesIceModule { }
