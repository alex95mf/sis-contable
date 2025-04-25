import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BitacoraComponent } from './bitacora.component';
import { BitacoraRoutingModule } from './bitacora-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  imports: [
    FormsModule,
    BitacoraRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    NgxPrintModule,
    CalendarModule,
    DatePickerModule,
    AppCustomModule
  ],
  declarations: [BitacoraComponent],
  providers: [
    ExcelService
  ],
})

export class BitacoraModule { }
