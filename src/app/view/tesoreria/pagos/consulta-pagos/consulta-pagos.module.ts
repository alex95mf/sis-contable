import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConsultaPagosRoutingModule } from './consulta-pagos-routing.module'; 
import { ConsultaPagosComponent } from './consulta-pagos.component'; 
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ConsultaPagosComponent,
    
  ],
  imports: [
    CommonModule,
    ConsultaPagosRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ConsultaPagosModule { }
