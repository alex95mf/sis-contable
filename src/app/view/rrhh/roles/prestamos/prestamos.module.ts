import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PrestamosComponent } from './prestamos.component';
import { PrestamosRoutingModule } from './prestamos.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { PersonalComponent } from './personal/personal.component';
import { ViewComponent } from './view/view.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    PrestamosRoutingModule,
    AppCustomModule
  ],
  declarations: [PrestamosComponent, PersonalComponent, ViewComponent],
})

export class  PrestamosModule { }
