import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import {UtilidadesComponent} from './utilidades.component';
import {UtilidadesRoutingModule} from './utilidades.routing'

@NgModule({
  declarations: [UtilidadesComponent],
  imports: [
    AppCustomModule,
    UtilidadesRoutingModule
  ]
})
export class UtilidadesModule { }
