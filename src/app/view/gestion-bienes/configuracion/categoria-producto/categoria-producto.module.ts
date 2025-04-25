import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProductoRoutingModule } from './categoria-producto-routing.module';
import { ModalCreacionComponent } from './modal-creacion/modal-creacion.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CategoriaProductoComponent } from './categoria-producto.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';




@NgModule({
  declarations: [
    ModalCreacionComponent,
    ModalEditionComponent,
    CategoriaProductoComponent,
    ModalCuentPreComponent,
    
  ],
  imports: [
    CommonModule,
    CategoriaProductoRoutingModule,
    AppCustomModule
  ]
})
export class CategoriaProductoModule { }
