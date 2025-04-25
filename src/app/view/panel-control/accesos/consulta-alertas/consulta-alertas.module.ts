import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ConsultaAlertasRoutingModule } from './consulta-alertas-routing.module';
import { ConsultaAlertasComponent } from './consulta-alertas.component';
import { ExcelService } from 'src/app/services/excel.service';



@NgModule({
  declarations: [
    ConsultaAlertasComponent
  ],
  imports: [
    CommonModule,
    ConsultaAlertasRoutingModule,
    AppCustomModule,
  ],
  providers: [
    ExcelService
  ],
})
export class ConsultaAlertasModule { }
