import { NgModule } from '@angular/core';
import { ConsultaCajachComponent } from './consulta-cajach.component';
import { ConsultaCajachRoutingModule } from './consulta-cajach.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ConsultaCajachComponent],
  imports: [
    ConsultaCajachRoutingModule,
    AppCustomModule,
  ]
})
export class ConsultaCajachCModule { }
