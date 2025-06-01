import { NgModule } from '@angular/core';
import { DiarioComponent } from './diario.component';
import { DiarioRoutingModule } from './diario.routing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { TreeviewModule } from 'ngx-treeview';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ExcelService } from '../../../../services/excel.service';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ViewDocumentDtComponent } from './view-document-dt/view-document-dt.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import { ModalBusquedaAuxiliarComponent } from './modal-busqueda-auxiliar/modal-busqueda-auxiliar.component';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
    imports: [
        FormsModule,
        DiarioRoutingModule,
        //ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        DataTablesModule,
        NgbModule,
        NgSelectModule,
        CommonModule,
        FlatpickrModule.forRoot(),
        NgxPrintModule,
        InfiniteScrollModule,
        TreeViewModule,
        DatePickerModule,
        AppCustomModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        InputTextModule,
        CalendarModule,
        ButtonModule,
        ButtonsModule.forRoot(),
        NgxCurrencyDirective,
    ],
    declarations: [DiarioComponent, ViewDocumentDtComponent, ModalBusquedaAuxiliarComponent],
    providers: [
        ExcelService
    ]
})
export class DiarioModule { }
