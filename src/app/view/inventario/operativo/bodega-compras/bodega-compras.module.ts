import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodegaComprasComponent } from './bodega-compras.component'
import { BodegaComprasRoutingModule } from './bodega-compras.routing'
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { ConfirmPurchaseWineryComponent } from '../../../commons/modals/confirm-purchase-winery/confirm-purchase-winery.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ViewFacCompraComponent } from './view-fac-compra/view-fac-compra.component';

@NgModule({
  declarations: [BodegaComprasComponent, ConfirmPurchaseWineryComponent, ViewFacCompraComponent],
  imports: [
    CommonModule,
    BodegaComprasRoutingModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgSelectModule,
    NgbModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxPrintModule,
    AppCustomModule
  ],

})
export class BodegaComprasModule { }
