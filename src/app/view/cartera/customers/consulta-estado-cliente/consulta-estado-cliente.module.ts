import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ConsultaEstadoClienteComponent } from './consulta-estado-cliente.component';
import { ConsultaEstadoClienteRoutingModule } from './consulta-estado-cliente.rountig';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ModalConsultaClienteComponent } from './modal-consulta-cliente/modal-consulta-cliente.component';

@NgModule({
  declarations: [ConsultaEstadoClienteComponent,ModalConsultaClienteComponent],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    BsDropdownModule,
    DatePickerModule,
    DataTablesModule,
    ConsultaEstadoClienteRoutingModule,
    BaseChartDirective,
    ButtonsModule,
    NgSelectModule,
    FlatpickrModule,
    NgxPrintModule,
    InfiniteScrollModule,
    TreeViewModule,
    ReactiveFormsModule,
    AppCustomModule
  ],
})
export class ConsultaEstadoClientetModule { }
