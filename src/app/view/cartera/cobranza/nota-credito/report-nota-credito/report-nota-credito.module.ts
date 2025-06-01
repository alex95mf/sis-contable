import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReportNotaRoutingModule } from './report-nota-credito.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportNotaCreditoComponent } from './report-nota-credito.component';
import { DataTablesModule } from 'angular-datatables';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../../commons/modals/modal.module'
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AppCustomModule } from '../../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReportNotaRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgbModule,
    DataTablesModule,
    DatePickerModule,
    CalendarModule,
    NgSelectModule,
    CommonModalModule,
    NgxBarcode6Module,
    NgxPrintModule,
    FlatpickrModule,
    ButtonsModule.forRoot(),
    AppCustomModule
  ],
  declarations: [ReportNotaCreditoComponent]
})
export class  ReportNotaCreditoModule { }
