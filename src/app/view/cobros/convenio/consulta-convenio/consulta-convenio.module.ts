import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaConvenioRoutingModule } from './consulta-convenio-routing.module';
import { ConsultaConvenioComponent } from './consulta-convenio.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    ConsultaConvenioComponent
  ],
  imports: [
    CommonModule,
    ConsultaConvenioRoutingModule,
    AppCustomModule
  ]
})
export class ConsultaConvenioModule { }
