import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EgresosBodegaRoutingModule } from './egresos-bodega-routing.module'; 
//import { EgresosBodegaComponent } from './egresos-bodega.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { BusquedaEgresosComponent } from './busqueda-egresos/busqueda-egresos.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { ModalProductoDetallesComponent } from './modal-producto-detalles/modal-producto-detalles.component';
import { ModalBuscaVehiculoComponent } from './modal-busca-vehiculo/modal-busca-vehiculo.component';



@NgModule({
  declarations: [
    //EgresosBodegaComponent
    BusquedaEgresosComponent,
    ListBusquedaComponent,
    ModalProductoDetallesComponent,
    ModalBuscaVehiculoComponent
  ],
  imports: [
    CommonModule,
    EgresosBodegaRoutingModule,
    AppCustomModule
  ]
})
export class EgresosBodegaModule { }