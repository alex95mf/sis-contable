import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConsultaImportacionComponent} from './consulta-importacion.component';
import { ConsultaImportaciongRoutingModule } from './consulta-importacion.routing';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
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
import { ViewConsultaComponent } from './view-consulta/view-consulta.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    CommonModule,
    ConsultaImportaciongRoutingModule,
    DataTablesModule,
    NgxExtendedPdfViewerModule,
    NgxDocViewerModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    NgxPrintModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgSelectModule,
    CommonModalModule,
    DatePickerModule,
    AppCustomModule
  ],

  declarations: [
    ConsultaImportacionComponent, ViewConsultaComponent
  ],

})
export class ConsultaImportacionModule { }
