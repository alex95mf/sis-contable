import { NgModule } from '@angular/core';
import { PagoAnticipadoRoutingModule } from './pago-anticipado.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { PagoAnticipadoComponent } from './pago-anticipado.component';
import { ListaCxpComponent } from './lista-cxp/lista-cxp.component';

@NgModule({
  declarations: [PagoAnticipadoComponent, ListaCxpComponent],
  imports: [
    AppCustomModule,
    PagoAnticipadoRoutingModule
  ]
})
export class PagoAnticipadoModule { }
