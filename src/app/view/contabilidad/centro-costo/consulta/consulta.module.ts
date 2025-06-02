import { NgModule } from '@angular/core';
import {ConsultaComponent} from './consulta.component';
import {ConsultaRoutingModule} from './consulta.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ConsultaComponent],
  imports: [
    ConsultaRoutingModule,
    AppCustomModule
  ],
})
export class ConsultaCentroModule { }
