import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConsultaTitulosRoutingModule } from './consulta-titulos-routing.module';
import { ConsultaTitulosComponent } from './consulta-titulos.component';
import { ModalTasasComponent } from './modal-tasas/modal-tasas.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ConsultaTitulosComponent,
    ModalTasasComponent
  ],
  imports: [
    CommonModule,
    ConsultaTitulosRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ConsultaTitulosModule { }
