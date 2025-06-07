import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoPresupuestoRoutingModule } from './catalogo-presupuesto-routing.module';
import { CatalogoPresupuestoComponent } from './catalogo-presupuesto.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    CatalogoPresupuestoComponent
  ],
  imports: [
    FormsModule,
    TableModule,
    CatalogoPresupuestoRoutingModule,
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
    TreeViewModule,
  ],
  providers: [
    ExcelService

]
})
export class CatalogoPresupuestoModule { }
