import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaCotizacionesRoutingModule } from './consulta-cotizaciones-routing.module';
import { ConsultaCotizacionesComponent } from './consulta-cotizaciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    ConsultaCotizacionesComponent
  ],
  imports: [
    CommonModule,
    ConsultaCotizacionesRoutingModule,
    AppCustomModule
  ]
})
export class ConsultaCotizacionesModule { }
