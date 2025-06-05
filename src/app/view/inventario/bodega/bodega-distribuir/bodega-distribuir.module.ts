import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodegaDistribuirComponent } from './bodega-distribuir.component'
import { BodegaDistribuirRoutingModule } from './bodega-distribuir.routing'
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [BodegaDistribuirComponent],
  imports: [
    CommonModule,
    BodegaDistribuirRoutingModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    NgSelectModule,
    NgbModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxPrintModule,
    AppCustomModule
  ]
})
export class BodegaDistribuirModule { }
