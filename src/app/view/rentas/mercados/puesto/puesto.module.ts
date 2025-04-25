import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { PuestoRoutingModule } from './puesto-routing.module';
import { PuestoComponent } from './puesto.component';
import { ListPuestosComponent } from './list-puestos/list-puestos.component';
import { ModalPuestosComponent } from './modal-puestos/modal-puestos.component';


@NgModule({
  declarations: [
    PuestoComponent,
    ListPuestosComponent,
    ModalPuestosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    PuestoRoutingModule
  ]
})
export class PuestoModule { }
