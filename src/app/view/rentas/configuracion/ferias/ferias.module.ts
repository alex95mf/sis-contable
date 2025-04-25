import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeriasRoutingModule } from './ferias.routing';
import { FeriasComponent } from './ferias.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalFeriasComponent } from './modal-ferias/modal-ferias.component';
import { ModalContribuyenteComponent } from './modal-contribuyente/modal-contribuyente.component';


@NgModule({
  declarations: [
    FeriasComponent,
    ModalFeriasComponent,
    ModalContribuyenteComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    FeriasRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class FeriasModule { }
