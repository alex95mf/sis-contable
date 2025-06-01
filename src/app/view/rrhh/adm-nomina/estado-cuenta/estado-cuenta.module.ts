import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoCuentaRoutingModule } from './estado-cuenta.routing';
import { EstadoCuentaComponent } from './estado-cuenta.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    EstadoCuentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyDirective,
    EstadoCuentaRoutingModule
  ]
})
export class EstadoCuentaModule { }
