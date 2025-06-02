import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevolucionesComponent } from './devoluciones.component';
import { DevolucionesRoutingModule } from './devoluciones.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ShowDevolucionComponent } from './show-devolucion/show-devolucion.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [DevolucionesComponent, ShowDevolucionComponent],
  imports: [
    CommonModule,
    DevolucionesRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
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

export class DevolucionesModule { }
