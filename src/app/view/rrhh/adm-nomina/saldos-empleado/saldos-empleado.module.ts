import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaldosEmpleadoRoutingModule } from './saldos-empleado.routing';
import { SaldosEmpleadoComponent } from './saldos-empleado.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SaldosEmpleadoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyDirective,
    SaldosEmpleadoRoutingModule,
  ]
})
export class SaldosEmpleadoModule { }
