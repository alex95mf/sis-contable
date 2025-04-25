import { NgModule } from '@angular/core';
import { ParametroadComponent } from './parametroad.component';
import { ParametroadRoutingModule } from './parametroad.routing';
import { TableCuentaComponent } from './table-cuenta/table-cuenta.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    ParametroadRoutingModule,
    AppCustomModule
  ],
  declarations: [ParametroadComponent, TableCuentaComponent]
})
export class ParametroadModule { }
