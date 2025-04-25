import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaTrabajoGeneralRoutingModule } from './bandeja-trabajo-general-routing.module';
import { BandejaTrabajoGeneralComponent } from './bandeja-trabajo-general.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ReasignarUsuarioComponent } from './reasignar-usuario/reasignar-usuario.component';


@NgModule({
  declarations: [
    BandejaTrabajoGeneralComponent,
    ReasignarUsuarioComponent
  ],
  imports: [
    CommonModule,
    BandejaTrabajoGeneralRoutingModule,
    AppCustomModule
  ]
})
export class BandejaTrabajoGeneralModule { }
