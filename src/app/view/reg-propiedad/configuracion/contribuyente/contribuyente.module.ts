import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContribuyenteRoutingModule } from './contribuyente.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ContribuyenteComponent } from './contribuyente.component';
//import { ContactosContribuyenteComponent } from './contactos/contactos.component';
import { ShowContribuyenteComponent } from './show-contribuyente/show-contribuyente.component';

@NgModule({
  declarations: [ContribuyenteComponent/*,ContactosContribuyenteComponent*/,ShowContribuyenteComponent],
  imports: [
    CommonModule,
    ContribuyenteRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgxPrintModule,
    MultiSelectModule,
    NgxDocViewerModule,
    DatePickerModule,
    AppCustomModule
  ],
})

export class ContribuyenteModule { }
