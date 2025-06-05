import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaComponent } from './consulta.component'
import { ConsultaRoutingModule } from './consulta.routing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ConsultaComponent],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    FormsModule,
    NgbModule,
    DataTablesModule,
    BsDropdownModule,
    DatePickerModule,
    CalendarModule,
    NgSelectModule,
    BaseChartDirective,
    ButtonsModule,
    CommonModalModule,
    FlatpickrModule,
    NgxPrintModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    AppCustomModule
  ]
})
export class ConsultaCajaModule { }
