import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecaudacionRoutingModule } from './recaudacion-routing.module';
//import { ReporteComponent } from './reporte/reporte.component';
import { ExcelService } from 'src/app/services/excel.service';



@NgModule({
  declarations: [ 
    //ReporteComponent
  ],
  imports: [
    CommonModule,
    RecaudacionRoutingModule
  ],
  providers: [
    ExcelService
  ],
})
export class RecaudacionModule { }
