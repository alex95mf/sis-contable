import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NuevaConsultaRoutingModule } from './nueva-consulta.routing';
import { NuevaConsultaComponent } from './nueva-consulta.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    NuevaConsultaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyDirective,
    NuevaConsultaRoutingModule
  ],
  providers: [
    DialogService,
    ExcelService,
  ]
})
export class NuevaConsultaModule { }
