import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ParametroComponent } from './parametro.component';
import { ParametroRoutingModule } from './parametro.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppCustomModule } from '../../../config/custom/app-custom.module';
@NgModule({
  imports: [
    FormsModule,
    ParametroRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    NgSelectModule,
    NgbModule,
    DataTablesModule,
    FlatpickrModule,
    DatePickerModule,
    ButtonModule,
    MultiSelectModule,
    AppCustomModule
  ],
  declarations: [ParametroComponent]
})

export class CatalogoModule { }
