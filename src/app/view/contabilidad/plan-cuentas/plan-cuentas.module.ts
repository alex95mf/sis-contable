import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PlanCuentasComponent } from './plan-cuentas.component';
import { PlanCuentasRoutingModule } from './plan-cuentas.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { TreeviewModule } from 'ngx-treeview';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ExcelService } from '../../../services/excel.service';
import { AppCustomModule } from '../../../config/custom/app-custom.module';
import { TableModule } from 'primeng/table';
import { ModalReglaPresupuestariaComponent } from './modal-regla-presupuestaria/modal-regla-presupuestaria.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';



@NgModule({
  imports: [
    FormsModule,
    TableModule,
    PlanCuentasRoutingModule,
    //BaseChartDirective,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    NgxPrintModule,
    AppCustomModule,
    InfiniteScrollModule,
    TreeViewModule
  ],
  declarations: [PlanCuentasComponent,ModalReglaPresupuestariaComponent,ModalCuentPreComponent],
  providers: [
      ExcelService

  ]
})
export class PlanCuentasModule { }
