import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CobranzaComponent } from './cobranza.component';
import { CobranzaRoutingModule } from './cobranza.routing';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CuentaClienteComponent } from './cuenta-cliente/cuenta-cliente.component';


@NgModule({
  declarations: [CobranzaComponent, CuentaClienteComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    NgxPrintModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    CobranzaRoutingModule,
    AppCustomModule
  ],
})
export class CobranzaModule { }
