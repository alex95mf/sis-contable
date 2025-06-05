import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CalendarModule,
    DatePickerModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    FlatpickrModule,
    NgxPrintModule,

  ]
})
export class MaintenanceModule { }
