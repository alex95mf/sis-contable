import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaComponent } from './consulta.component';
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { ShowProgramaComponent } from './show/show.component';


@NgModule({
  declarations: [
    ConsultaComponent,
    ShowProgramaComponent
  ],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    AppCustomModule
  ]
})
export class ProgramaConsultaModule { }
