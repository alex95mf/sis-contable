import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GastosComponent} from './gastos.component';
import {GastoRoutingModule} from './gastos.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DiferedCuotasComponent } from './difered-cuotas/difered-cuotas.component';
import { ShowGastosComponent } from './show-gastos/show-gastos.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [GastosComponent, DiferedCuotasComponent, ShowGastosComponent],
  imports: [
    CommonModule,
    GastoRoutingModule,
    NgSelectModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    DataTablesModule,
    NgxPrintModule,
    MultiSelectModule,
    CommonModalModule,
    NgxDocViewerModule,
    FlatpickrModule,
    CalendarModule,
    DatePickerModule,
    AppCustomModule
  ],
})
export class GastosModule { }
