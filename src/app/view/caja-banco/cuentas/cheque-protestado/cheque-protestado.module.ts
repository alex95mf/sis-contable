import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ChequeProtestadoComponent } from './cheque-protestado.component';
import { ChequeProtestadoRoutingModule } from './cheque-protestado.routing';

@NgModule({
  declarations: [ChequeProtestadoComponent],
  imports: [
    ChequeProtestadoRoutingModule,
    AppCustomModule
  ]
})
export class ChequeProtestadotModule { }
