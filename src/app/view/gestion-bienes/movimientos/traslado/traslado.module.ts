import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrasladoRoutingModule } from './traslado-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { BusquedaTrasladoComponent } from './busqueda-traslado/busqueda-traslado.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { DetallesProductoComponent } from './detalles-producto/detalles-producto.component';


@NgModule({
  declarations: [
    BusquedaTrasladoComponent,
    ModalVistaFotosComponent,
    DetallesProductoComponent
  ],
  imports: [
    CommonModule,
    TrasladoRoutingModule,
    AppCustomModule
  ]
})
export class TrasladoModule { }
