import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { TabsIngresoComponent } from './tabs-ingreso/tabs-ingreso.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';

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


import { ProductoRoutingModule } from './producto-routing.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalReclamosComponent } from './modal-reclamos/modal-reclamos.component';
import { ModalUdmComponent } from './modal-udm/modal-udm.component';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';


@NgModule({
  declarations: [
    //TabsIngresoComponent,
    ModalReclamosComponent,
    ModalUdmComponent,
    ModalVistaFotosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ProductoRoutingModule,
    CalendarModule,
    FormsModule,
    CommonModule,
    BaseChartDirective,
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
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxPrintModule,
    MultiSelectModule,
    MatTabsModule,

  ],

})
export class ProductoModule { }
