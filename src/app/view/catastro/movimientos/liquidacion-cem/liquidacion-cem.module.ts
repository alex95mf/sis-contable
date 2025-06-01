import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidacionCemRoutingModule } from './liquidacion-cem.routing';
import { LiquidacionCemComponent } from './liquidacion-cem.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';


@NgModule({
  declarations: [
    LiquidacionCemComponent,
    ModalBusquedaComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    LiquidacionCemRoutingModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class LiquidacionCemModule { }
