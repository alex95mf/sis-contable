import { NgModule } from '@angular/core';
import { ParametrosComponent } from './parametros.component';
import { ParametrosRoutingModule } from './parametros.routing'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ParametrosComponent],
  imports: [
    ParametrosRoutingModule,
    AppCustomModule
  ]
})
export class ParametrosModule { }
