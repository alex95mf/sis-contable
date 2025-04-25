import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaDirectorioRoutingModule } from './consulta-directorio-routing.module';
import { ConsultaDirectorioComponent } from './consulta-directorio.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { DetallePrestamoComponent } from './detalle-prestamo/detalle-solicitud.component';

@NgModule({
  declarations: [
    ConsultaDirectorioComponent,DetallePrestamoComponent
  ],
  imports: [
    CommonModule,
    ConsultaDirectorioRoutingModule,
    AppCustomModule
  ]
})
export class ConsultaDirectorioModule { }
