import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { ModalBuscarProductoComponent } from './modal-buscar-producto/modal-buscar-producto.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';


@NgModule({
  declarations: [
    ProductoComponent,
    ModalBuscarProductoComponent,
    ModalVistaFotosComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    AppCustomModule,
   
  ]
})
export class ProductoModule { }
