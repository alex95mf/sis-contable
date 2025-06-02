import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AperturaComponent } from './apertura.component';
import { AperturaRoutingModule } from './apertura.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowDenominationComponent } from './show-denomination/show-denomination.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [AperturaComponent, ShowDenominationComponent],
  imports: [
    CommonModule,
    AperturaRoutingModule,
    NgSelectModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    AppCustomModule
  ],
})
export class AperturaModule { }
