import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CedulaPresupuestariaRoutingModule } from './cedula-presupuestaria-routing.module';
import { CedulaPresupuestariaComponent } from './cedula-presupuestaria.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { DetalleReformaComponent } from './detalle-reforma/detalle-reforma.component';


@NgModule({
  declarations: [
    CedulaPresupuestariaComponent,
    DetalleReformaComponent
  ],
  imports: [
    CommonModule,
    CedulaPresupuestariaRoutingModule,
    AppCustomModule
  ]
})
export class CedulaPresupuestariaModule { }
