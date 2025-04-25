import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { GestionJuicioRoutingModule } from './gestion-juicio.routing';
import { GestionJuicioComponent } from './gestion-juicio.component';


@NgModule({
  declarations: [
    GestionJuicioComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    GestionJuicioRoutingModule
  ]
})
export class GestionJuicioModule { }
