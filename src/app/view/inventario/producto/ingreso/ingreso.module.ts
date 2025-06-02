import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { IngresoComponent } from './ingreso.component';
import { IngresoRoutingModule } from './ingreso.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsIngresoComponent } from './tabs-ingreso/tabs-ingreso.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ViewerComponent } from '../../../commons/modals/viewer/viewer.component'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { QRCodeComponent } from 'angularx-qrcode';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    IngresoRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgbModule,
    NgSelectModule,
    DataTablesModule,
    NgxDocViewerModule,
    QRCodeComponent,
    ButtonsModule.forRoot(),
    CommonModalModule,
    NgxExtendedPdfViewerModule,
    FlatpickrModule,
    ButtonModule,
    DatePickerModule,
    AppCustomModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxPrintModule,
    MultiSelectModule,

  ],
  declarations: [
    IngresoComponent, TabsIngresoComponent, ViewerComponent
  ],
})
export class IngresoProductoModule { }
