import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RetencionCompraRoutingModule } from './retencion-compra.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RetencionCompraComponent } from './retencion-compra.component';
import { DataTablesModule } from 'angular-datatables';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { FacPdfComponent } from './fac-pdf/fac-pdf.component';
import { ImprimirComponentGlobal } from './imprimir-com-elect/imprimir-com-elect.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RetencionCompraRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    DataTablesModule,
    DatePickerModule,
    CalendarModule,
    NgSelectModule,
    CommonModalModule,
    NgxBarcode6Module,
    NgxPrintModule,
    FlatpickrModule,
    ButtonsModule.forRoot(),
    AppCustomModule

  ],
  exports: [
    FacPdfComponent,
    ImprimirComponentGlobal
  ],
  declarations: [RetencionCompraComponent,FacPdfComponent,ImprimirComponentGlobal]
})
export class    RetencionCompraModule { }
