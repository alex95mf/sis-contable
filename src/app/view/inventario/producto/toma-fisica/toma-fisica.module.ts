import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TomaFisicaComponent } from './toma-fisica.component';
import { TomaFisicaRoutingModule } from './toma-fisica.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentasComponent } from './cuentas/cuentas.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { CuentaViewsComponent } from './cuenta-views/cuenta-views.component';

@NgModule({
  declarations: [
    TomaFisicaComponent,
    CuentasComponent,
    CuentaViewsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    TomaFisicaRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    NgSelectModule,
    DataTablesModule,
    NgxDocViewerModule,
    ButtonsModule.forRoot(),
    CommonModalModule,
    NgxExtendedPdfViewerModule,
    DatePickerModule,
    CalendarModule,
    FlatpickrModule,
    MultiSelectModule,
    NgxPrintModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    AppCustomModule
  ],

})
export class TomaFisicaModule { }
