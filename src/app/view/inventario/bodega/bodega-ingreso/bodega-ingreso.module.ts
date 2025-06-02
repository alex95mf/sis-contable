import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BodegaIngresoComponent} from './bodega-ingreso.component'
import {BodegaIngresoRoutingModule} from './bodega-ingreso.routing'
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { TabsBodegaComponent } from './tabs-bodega/tabs-bodega.component';
import { TabsEstructuraComponent } from './tabs-estructura/tabs-estructura.component';
import { ModalMovimientoComponent } from './modal-movimiento/modal-movimiento.component';
import {NgxPrintModule} from 'ngx-print';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [BodegaIngresoComponent, TabsBodegaComponent, TabsEstructuraComponent, ModalMovimientoComponent],
  imports: [
    CommonModule,
    BodegaIngresoRoutingModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgSelectModule,
    NgbModule,
    DataTablesModule,
    NgxPrintModule,
    AppCustomModule
  ],
})
export class BodegaIngresoModule { }
