import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaCreditoComponent } from './nota-credito.component';
import { NotaCreditoRoutingModule } from './nota-credito.routing';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { ShowNotasCreditoComponent } from './show-notas-credito/show-notas-credito.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ReportNotaCreditoComponent } from './report-nota-credito/report-nota-credito.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
@NgModule({
  declarations: [NotaCreditoComponent, ShowCuentasComponent, ShowNotasCreditoComponent, ReportNotaCreditoComponent],
  imports: [
    CommonModule,
    NotaCreditoRoutingModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    FlatpickrModule,
    NgxPrintModule,
    DatePickerModule,
    AppCustomModule
  ], 
  entryComponents:[
    ShowCuentasComponent, ShowNotasCreditoComponent, ReportNotaCreditoComponent
  ]
})
export class NotaCreditoModule { }
