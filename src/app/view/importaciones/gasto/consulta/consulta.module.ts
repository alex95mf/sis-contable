import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaComponent } from './consulta.component';
import {ConsultaRoutingModule} from './consulta.routing';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ViewConsultaGastoComponent } from './view-consulta-gasto/view-consulta-gasto.component';


@NgModule({
  declarations: [ConsultaComponent, ViewConsultaGastoComponent],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgSelectModule,
    CommonModalModule,
    InfiniteScrollModule,
    DatePickerModule,
    DataTablesModule,
    FlatpickrModule,
    AppCustomModule
  ],
})
export class ConsultaModule { }
