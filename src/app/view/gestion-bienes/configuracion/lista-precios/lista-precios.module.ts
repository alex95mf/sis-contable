import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaPreciosComponent } from './lista-precios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ListaPreciosRoutingModule } from './lista-precios-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [ListaPreciosComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ListaPreciosRoutingModule,
    NgSelectModule,
    CommonModalModule,
    ButtonsModule,
    ChartsModule,
    NgxBarcode6Module,
    NgxPrintModule,
    FlatpickrModule,
    AppCustomModule,
    NgxCurrencyDirective,
  ],
  providers: [
    ExcelService
  ]
})
export class ListaPreciosModule { }
