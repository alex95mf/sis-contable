import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacturaCompraComponent} from './factura-compra.component';
import {FacturaCompraRoutingModule} from './factura-compra.routing'
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DiferidoComponent } from './diferido/diferido.component'
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [FacturaCompraComponent, DiferidoComponent],
  imports: [
    CommonModule,
    FacturaCompraRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgxPrintModule,
    MultiSelectModule,
    CommonModalModule,
    NgxDocViewerModule,
    DatePickerModule,
    AppCustomModule
  ],
  entryComponents: [
    DiferidoComponent
  ]
})
export class FacturaCompraModule { }
