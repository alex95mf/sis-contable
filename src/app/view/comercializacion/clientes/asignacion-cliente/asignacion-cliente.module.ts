import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AsignacionClienteComponent } from './asignacion-cliente.component';
import { AsignacionClienteRoutingModule } from './asignacion-cliente.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  imports: [
    FormsModule,
    AsignacionClienteRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    NgSelectModule,
    NgbModule,
    DataTablesModule,
    FlatpickrModule,
    DatePickerModule,
    ButtonModule,
    MultiSelectModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    AppCustomModule
  ],
  declarations: [AsignacionClienteComponent]
})

export class AsignacionClienteModule { }
