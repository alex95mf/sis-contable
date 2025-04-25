import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BalancecomprobacionComponent } from './balancecomprobacion.component';
import { BalanceComprobacionRoutingModule } from './balancecomprobacion.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { TreeviewModule } from 'ngx-treeview';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ExcelService } from '../../../../services/excel.service';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    BalanceComprobacionRoutingModule, 
    AppCustomModule
  ],
  declarations: [BalancecomprobacionComponent],
  providers: [
    ExcelService
  ]
})
export class BalancecomprobacionModule { }
