import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ContableComponent } from './contable.component';
import { contableRoutingModule } from './contable.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { ParametroCuentaComponent } from './parametro-cuenta/parametro-cuenta.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MultiSelectModule,
    DatePickerModule,
    CommonModalModule,
    ButtonModule,
    contableRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgSelectModule,
    DataTablesModule,
    FlatpickrModule,
    NgbModule,
    ButtonsModule.forRoot(),
    AppCustomModule
  ],
  declarations: [ContableComponent, ParametroCuentaComponent],
})
export class ContableModule { }
