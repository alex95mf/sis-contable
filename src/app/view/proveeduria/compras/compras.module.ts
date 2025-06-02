import { NgModule } from '@angular/core';
import {ComprasComponent} from './compras.component';
import {ComprasRoutingModule} from './compras.routing';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
import { ShowInvoicesComponent } from './show-invoices/show-invoices.component';
import { AppCustomModule } from '../../../config/custom/app-custom.module';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ModalComprasComponent } from './modal-compras/modal-compras.component';
import { ModalCargaxmlComponent } from './modal-cargaxml/modal-cargaxml.component';
import { MatTableModule } from '@angular/material/table';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalCuentasPorPagarComponent } from './modal-cuentas-por-pagar/modal-cuentas-por-pagar.component';
import { ModalCuentaRetFuenteComponent } from './modal-cuenta-ret-fuente/modal-cuenta-ret-fuente.component';
import { ModalCuentaRetIvaComponent } from './modal-cuenta-ret-iva/modal-cuenta-ret-iva.component';


@NgModule({
  declarations: [ComprasComponent, DiferedBuyProvComponent, ShowInvoicesComponent, ModalComprasComponent, ModalCargaxmlComponent, ModalCuentasPorPagarComponent, ModalCuentaRetFuenteComponent, ModalCuentaRetIvaComponent],
  imports: [
    ComprasRoutingModule,
    DividerModule,
    AppCustomModule,
    CheckboxModule,
    CalendarModule,
    MatTableModule,
    NgxCurrencyDirective

  ],
  providers: [
    ExcelService
  ]
})
export class ComprasModule { }
