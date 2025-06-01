import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoBodegaRoutingModule } from './ingreso-bodega-routing.module';
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
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { ModalSolicitudCatComponent } from './modal-solicitud-cat/modal-solicitud-cat.component';
import { ModalProductoDetallesComponent } from './modal-producto-detalles/modal-producto-detalles.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [ShowOrderComponent, ModalSolicitudComponent,ModalSolicitudCatComponent, ModalProductoDetallesComponent],
  imports: [
    CommonModule,
    IngresoBodegaRoutingModule,
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
    AppCustomModule,
    NgxCurrencyDirective,
  ],
  entryComponents: [
    ShowOrderComponent
  ]
})
export class IngresoBodegaModule { }
