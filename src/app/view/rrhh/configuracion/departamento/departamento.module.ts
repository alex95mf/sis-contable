import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalNewUpdComponent } from './modal-new-upd/modal-new-upd.component';
import { ModalAreaComponent } from './modal-area/modal-area.component';


@NgModule({
  declarations: [
    DepartamentoComponent,
    ModalNewUpdComponent,
    ModalAreaComponent
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    AppCustomModule
  ]
})
export class DepartamentoModule { }
