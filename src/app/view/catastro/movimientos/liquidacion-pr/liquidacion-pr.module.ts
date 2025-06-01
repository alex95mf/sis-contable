import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidacionPrRoutingModule } from './liquidacion-pr.routing';
import { LiquidacionPrComponent } from './liquidacion-pr.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalContribuyenteComponent } from './modal-contribuyente/modal-contribuyente.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';


@NgModule({
  declarations: [
    LiquidacionPrComponent,
    ModalContribuyenteComponent,
    ModalConceptosComponent,
    ModalExoneracionesComponent,
    ModalLiquidacionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    LiquidacionPrRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class LiquidacionPrModule { }
