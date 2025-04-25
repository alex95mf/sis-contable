import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturasSaldoRoutingModule } from './facturas-saldo.routing';
import { FacturasSaldoComponent } from './facturas-saldo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { TableModule } from 'primeng/table';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';


@NgModule({
  declarations: [
    FacturasSaldoComponent,
    ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    TableModule,
    FacturasSaldoRoutingModule
  ]
})
export class FacturasSaldoModule { }
