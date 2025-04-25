import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaComponent } from './consulta.component';
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { ShowProyectoComponent } from './show/show.component';


@NgModule({
  declarations: [
    ConsultaComponent,
    ShowProyectoComponent
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    AppCustomModule
  ]
})
export class ProyectoConsultaModule { }
