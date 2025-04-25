import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsInvoiceComponent } from './reports-invoice.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReportsInvoiceRoutingModule } from './reports-invoice.routing'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ClienteComponent } from './cliente/cliente.component';
import { VendedorComponent } from './vendedor/vendedor.component';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
@NgModule({
  declarations: [ReportsInvoiceComponent, ClienteComponent, VendedorComponent],
  
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ReportsInvoiceRoutingModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    MultiSelectModule,
    ButtonModule,
    FlatpickrModule,
    NgSelectModule,
    ButtonsModule,
    NgxPrintModule,
    CommonModalModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    ChartsModule,
    AppCustomModule

  ],
  entryComponents: [
    ClienteComponent,VendedorComponent
  ]
  
})
export class ReportsInvoiceModule { }
