import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VencimientoRoutingModule } from './vencimiento.routing';
import { VencimientoComponent } from './vencimiento.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    VencimientoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    VencimientoRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class VencimientoModule { }
