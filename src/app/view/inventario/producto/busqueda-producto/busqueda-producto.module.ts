import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BusquedaProductoComponent } from './busqueda-producto.component';
import { BusquedaProductoRoutingModule } from './busqueda-producto.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ImagenesComponent } from './imagenes/imagenes.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DocumentComponent } from './document/document.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import {NgxPrintModule} from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    BusquedaProductoRoutingModule,
    ChartsModule,
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
    NgxDocViewerModule,
    NgxPrintModule,
    CommonModalModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    AppCustomModule
  ],
  declarations: [BusquedaProductoComponent, ImagenesComponent, DocumentComponent],
  entryComponents: [ImagenesComponent,DocumentComponent]
})

export class BusquedaProductoModule { }
