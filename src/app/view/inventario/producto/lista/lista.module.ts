import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaComponent } from './lista.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ListaRoutingModule } from './lista.routing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [ListaComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ListaRoutingModule,
    NgSelectModule,
    CommonModalModule,
    ButtonsModule,
    BaseChartDirective,
    NgxBarcode6Module,
    NgxPrintModule,
    FlatpickrModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ListaPrecioModule { }
