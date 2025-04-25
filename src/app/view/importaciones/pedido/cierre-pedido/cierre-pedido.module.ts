import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CierrePedidoComponent } from './cierre-pedido.component';
import { CierrePedidoRoutingModule } from './cierre-pedido.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgxPrintModule } from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { CommonModalModule } from '../../../commons/modals/modal.module'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ShowPedidoCerradoComponent } from './show-pedido-cerrado/show-pedido-cerrado.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [CierrePedidoComponent, ShowPedidoCerradoComponent],
  imports: [
    CommonModule,
    CierrePedidoRoutingModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    DataTablesModule,
    NgxPrintModule,
    MultiSelectModule,
    CommonModalModule,
    NgxDocViewerModule,
    FlatpickrModule,
    CalendarModule,
    DatePickerModule,
    AppCustomModule
  ],
  entryComponents: [
    ShowPedidoCerradoComponent
  ]
})
export class CierrePedidoModule { }
