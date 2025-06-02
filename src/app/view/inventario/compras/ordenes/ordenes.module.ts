import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesRoutingModule } from './ordenes.routing'
import { OrdenesComponent } from './ordenes.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { ShowOrderComponent } from './show-order/show-order.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [OrdenesComponent,ShowOrderComponent],
  imports: [
    CommonModule,
    OrdenesRoutingModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    DataTablesModule,
    NgxPrintModule,
    MultiSelectModule,
    CommonModalModule,
    NgxDocViewerModule,
    AppCustomModule
  ],
})
export class OrdenesModule { }
