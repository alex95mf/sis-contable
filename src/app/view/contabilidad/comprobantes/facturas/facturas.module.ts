import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturasRoutingModule } from './facturas-routing.module';
import { FacturasComponent } from './facturas.component';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
import { ShowInvoicesComponent } from './show-invoices/show-invoices.component'; 
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalFacturasComponent } from './modal-facturas/modal-facturas.component';
import { BusquedaEgresosComponent } from './busqueda-egresos/busqueda-egresos.component';

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModalBusquedaFacturaComponent } from './modal-busqueda-factura/modal-busqueda-factura.component';
 //import { NgSelect2Module } from 'ng-select2';

@NgModule({
  declarations: [
    FacturasComponent,
    DiferedBuyProvComponent,
    ShowInvoicesComponent,
    ModalFacturasComponent,
    BusquedaEgresosComponent,
    ModalBusquedaFacturaComponent
  ],
  imports: [
    CommonModule,
    FacturasRoutingModule,
    AppCustomModule,
    TabMenuModule,
    TabViewModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    NgxCurrencyModule
    // NgSelect2Module
  ]
})
export class FacturasModule { }
