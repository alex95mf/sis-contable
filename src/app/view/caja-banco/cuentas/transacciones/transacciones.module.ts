import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TransaccionesComponent} from './transacciones.component';
import {TransaccionesRoutingModule} from './transacciones.routing';
import { DataTablesModule } from 'angular-datatables';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportesTransComponent } from './reportes-trans/reportes-trans.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [TransaccionesComponent, ReportesTransComponent],
  imports: [
    TransaccionesRoutingModule,
    AppCustomModule
  ],
})
export class TransaccionesModule { }
