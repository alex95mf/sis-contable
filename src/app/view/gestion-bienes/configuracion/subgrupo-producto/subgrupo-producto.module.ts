import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubgrupoProductoRoutingModule } from './subgrupo-producto-routing.module';
import { SubgrupoProductoComponent } from './subgrupo-producto.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component';
@NgModule({
  declarations: [
    SubgrupoProductoComponent,
    ModalGruposComponent
  ],
  imports: [
    CommonModule,
    SubgrupoProductoRoutingModule,
    AppCustomModule
  ]
})
export class SubgrupoProductoModule { }
