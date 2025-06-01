import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocElecRoutingModule } from './doc-elec.routing';
import { DocElecComponent } from './doc-elec.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    DocElecComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    DocElecRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class DocElecModule { }
