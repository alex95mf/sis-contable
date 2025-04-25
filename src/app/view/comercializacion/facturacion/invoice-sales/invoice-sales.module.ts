import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InvoiceSalesComponent} from './invoice-sales.component'
import {InvoiceInternalRoutingModule} from './invoice.routing'
import { DataTablesModule } from 'angular-datatables';
import { ModalInvoicesProductComponent } from './modal-invoices-product/modal-invoices-product.component';
import { DiferedComponent } from './difered/difered.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CommonModalModule } from '../../../commons/modals/modal.module';
@NgModule({
  declarations: [InvoiceSalesComponent, ModalInvoicesProductComponent, DiferedComponent],
  imports: [
    CommonModule,
    InvoiceInternalRoutingModule,
    DataTablesModule,
    AppCustomModule,
    CommonModalModule
  ],
  entryComponents: [
    ModalInvoicesProductComponent,
    DiferedComponent
  ]
})
export class InvoiceSalesModule { }
