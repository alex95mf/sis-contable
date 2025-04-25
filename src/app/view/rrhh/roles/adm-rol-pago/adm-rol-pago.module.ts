import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { AdmRolPagoComponent } from './adm-rol-pago.component';
import { AdmRolPagoRoutingModule } from './adm-rol-pago.routing';



@NgModule({
  declarations: [AdmRolPagoComponent],
  imports: [
    AppCustomModule,
    AdmRolPagoRoutingModule
  ]
})
export class AdmRolPagoModule { }
