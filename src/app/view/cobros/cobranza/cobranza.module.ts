import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobranzaRoutingModule } from './cobranza.routing';
import { FormularioConceptosComponent } from './formulario-conceptos/formulario-conceptos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormularioNotificacionesComponent } from './formulario-notificaciones/formulario-notificaciones.component';
import { ReporteComponent } from './reporte/reporte.component';


@NgModule({
  declarations: [
    FormularioConceptosComponent,
    ReporteComponent,
    
  ],
  imports: [
    CommonModule,
    CobranzaRoutingModule,
    AppCustomModule
  ]
})
export class CobranzaModule { }
