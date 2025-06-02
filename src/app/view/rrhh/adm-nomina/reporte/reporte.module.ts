import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ReporteComponent } from './reporte.component';
import {ReporteRoutingModule} from './reporte.routing';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ListadoComponent } from './listado/listado.component';
import { CargaComponent } from './carga/carga.component';
import { CumpleanioComponent } from './cumpleanio/cumpleanio.component'


import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ModalEmpleadosComponent } from './carga/modal-empleados/modal-empleados.component';
import { ExcelService } from 'src/app/services/excel.service';
@NgModule({
  declarations: [ReporteComponent, ListadoComponent, CargaComponent, CumpleanioComponent, ModalEmpleadosComponent],
  imports: [
    AppCustomModule,
    ReporteRoutingModule,
    CommonModule,
    DataTablesModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    FormsModule,
    DatePickerModule,
    CalendarModule,
    NgSelectModule,
    CommonModalModule,
    NgxPrintModule,
    FlatpickrModule,
    NgbModule

  ],
  providers: [
    ExcelService,
  ]
})
export class ReporteModule { }
