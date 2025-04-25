import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExoneracionesRoutingModule } from './exoneraciones-routing.module';
import { ExoneracionesComponent } from './exoneraciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExoneracionFormComponent } from './exoneracion-form/exoneracion-form.component';


@NgModule({
  declarations: [
    ExoneracionesComponent,
    ExoneracionFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ExoneracionesRoutingModule
  ]
})
export class ExoneracionesModule { }
