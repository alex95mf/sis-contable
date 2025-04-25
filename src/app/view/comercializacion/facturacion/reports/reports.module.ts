import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReportsRoutingModule } from './reports.routing'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ShowDevolutionComponent } from './show-devolution/show-devolution.component';

@NgModule({
  declarations: [ReportsComponent, ShowDevolutionComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ReportsRoutingModule,
    AppCustomModule
  ],
  entryComponents: [
    ShowDevolutionComponent
  ]
})
export class ReportsVentasModule { }
