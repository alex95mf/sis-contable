import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { EmpresarialComponent } from './empresarial.component';
import { EmpresarialRoutingModule } from './empresarial.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { TableSucursalComponent } from './component/table-sucursal/table-sucursal.component';
import { PuntoEmisionComponent } from './punto-emision/punto-emision.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MultiSelectModule,
    DatePickerModule,
    ButtonModule,
    EmpresarialRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgSelectModule,
    DataTablesModule,
    FlatpickrModule,
    NgbModule,
    ButtonsModule.forRoot(),
    AppCustomModule
  ],
  declarations: [EmpresarialComponent, TableSucursalComponent, PuntoEmisionComponent/* , TableCatalogosComponent, TableDocumentosComponent */]
})
export class EmpresarialModule { }
