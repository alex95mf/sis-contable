import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovContableComponent} from './mov-contable.component';
import { MovContableRoutingModule } from './mov-contable.routing';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule } from '@angular/forms';
//import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewAsientoDiarioComponent } from './view-asiento-diario/view-asiento-diario.component';
import { MovAsientoComponent } from './mov-asiento/mov-asiento.component';
import { MovAsientoDocumentoComponent } from './mov-asiento-documento/mov-asiento-documento.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ExcelService } from '../../../../services/excel.service';

import { CalendarModule } from 'primeng/calendar';
import {TableModule} from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        MovContableRoutingModule,
        DataTablesModule,
        NgxExtendedPdfViewerModule,
        NgxDocViewerModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        FlatpickrModule.forRoot(),
        NgxPrintModule,
        FormsModule,
        //BaseChartDirective,
        BsDropdownModule,
        ButtonsModule,
        NgbModule,
        NgSelectModule,
        CommonModalModule,
        DatePickerModule,
        AppCustomModule,
        CalendarModule,
        TableModule
    ],
    declarations: [
        MovContableComponent,
        ViewAsientoDiarioComponent,
        MovAsientoComponent,
        MovAsientoDocumentoComponent
    ],
    providers: [
        ExcelService
      ]
})
export class MovContableModule { }
