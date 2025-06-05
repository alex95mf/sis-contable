import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaDebitoComponent } from './nota-debito.component';
import { NotaDebitoRoutingModule } from './nota-debito.routing';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { ShowNotasDebitoComponent } from './show-notas-debito/show-notas-debito.component';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
/* import { ReportNotaDebitoComponent } from './report-nota-debito/report-nota-debito.component'; */
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [NotaDebitoComponent, ShowCuentasComponent, ShowNotasDebitoComponent/* , ReportNotaDebitoComponent */],
  imports: [
    AppCustomModule,
    CommonModule,
    NotaDebitoRoutingModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    FlatpickrModule,
    NgxPrintModule,
    DatePickerModule
  ],
})
export class NotaDebitoModule { }
