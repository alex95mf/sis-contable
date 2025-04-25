import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConsultaRoutingModule} from './consulta.routing'
import {ConsultaComponent} from './consulta.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ConsultaComponent],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    AppCustomModule
  ]
})
export class ConsultaModule { }
