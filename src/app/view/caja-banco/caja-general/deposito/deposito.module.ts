import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositoComponent } from './deposito.component';
import { DepositoRoutingModule } from './deposito.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [DepositoComponent],
  imports: [
    CommonModule,
    DepositoRoutingModule,
    NgSelectModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    AppCustomModule
  ],
})
export class DepositoModule { }
