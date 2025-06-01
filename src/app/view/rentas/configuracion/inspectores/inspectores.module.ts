import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectoresRoutingModule } from './inspectores.routing';
import { InspectoresComponent } from './inspectores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    InspectoresComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    InspectoresRoutingModule
  ],
  providers: [
    ExcelService,
    DialogService,
  ]
})
export class InspectoresModule { }
