import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsCompraComponent } from './reports-compra.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReportsCompraRoutingModule } from './reports-compra.routing'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ReportsCompraComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ReportsCompraRoutingModule,
    NgSelectModule,
    CommonModalModule,
    ButtonsModule,
    BaseChartDirective,
    AppCustomModule
  ]
})
export class ReportsCompraModule { }
