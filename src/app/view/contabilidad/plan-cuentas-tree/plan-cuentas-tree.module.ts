import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanCuentasTreeRoutingModule } from './plan-cuentas-tree.routing';
import { PlanCuentasTreeComponent } from './plan-cuentas-tree.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    PlanCuentasTreeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyModule,
    PlanCuentasTreeRoutingModule
  ]
})
export class PlanCuentasTreeModule { }
