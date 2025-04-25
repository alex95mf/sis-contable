import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectoresRoutingModule } from './inspectores.routing';
import { InspectoresComponent } from './inspectores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    InspectoresComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    InspectoresRoutingModule
  ],
  providers: [
    ExcelService,
    DialogService,
  ]
})
export class InspectoresModule { }
