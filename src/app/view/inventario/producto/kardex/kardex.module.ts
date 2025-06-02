import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KardexComponent} from './kardex.component';
import {KardexRoutingModule} from './kardex.routing'
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
import { IngresoAjusteComponent } from './ingreso-ajuste-component/ingreso-ajuste.component';
import { DetalleInformacionComponent } from './detalle-informacion-component/detalle-informacion.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
@NgModule({
  declarations: [KardexComponent, IngresoAjusteComponent, DetalleInformacionComponent],
  imports: [
    CommonModule,
    KardexRoutingModule,
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
})
export class KardexModule { }
