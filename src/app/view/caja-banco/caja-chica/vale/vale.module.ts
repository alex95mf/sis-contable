import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValeComponent } from './vale.component';
import { ValeRoutingModule } from './vale.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ReposicionComponent } from './reposicion/reposicion.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ValeComponent, ReposicionComponent],
  imports: [
    ValeRoutingModule,
    AppCustomModule
  ],
})
export class ValeModule { }
