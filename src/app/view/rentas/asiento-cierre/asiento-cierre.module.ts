import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { AsientoCierreRoutingModule } from './asiento-cierre-routing.module';
import { AsientoCierreComponent } from './asiento-cierre.component';
import { ModalCierresComponent } from './modal-cierres/modal-cierres.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalCuentasEmiComponent } from './modal-cuentas-emi/modal-cuentas-emi.component';
import { ModalCuentasContablesComponent } from './modal-cuentas-contables/modal-cuentas-contables.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    AsientoCierreComponent,
    ModalCierresComponent,
    ModalCuentPreComponent,
    ModalCuentasEmiComponent,
    ModalCuentasContablesComponent
  ],
  imports: [
    CommonModule,
    AsientoCierreRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ],
  providers: [
    DialogService,
    ExcelService,
  ]
})
export class AsientoCierreModule { }
