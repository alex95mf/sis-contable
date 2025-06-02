import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BodegaDespachoComponent } from './bodega-despacho.component';
import {BodegaDespachoRoutingModule} from './bodega-despacho.routing';
import { DataTablesModule } from 'angular-datatables';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowInvoiceComponent } from './show-invoice/show-invoice.component';
import { ConfirmInvoiceComponent } from './confirm-invoice/confirm-invoice.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [BodegaDespachoComponent, ShowInvoiceComponent, ConfirmInvoiceComponent],
  imports: [
    CommonModule,
    BodegaDespachoRoutingModule,
    DataTablesModule,
    DatePickerModule,
    NgbModule,
    FormsModule,
    NgxPrintModule,
    AppCustomModule
  ],
})
export class BodegaDespachoModule { }
