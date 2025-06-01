import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulacionRoutingModule } from './simulacion.routing';
import { SimulacionComponent } from './simulacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    SimulacionComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    SimulacionRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class SimulacionModule { }
