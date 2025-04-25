import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantenimientoComponent } from './mantenimiento.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListBusquedaPrestamoComponent } from './list-busqueda-prestamo/list-busqueda-prestamo.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { AnexosListComponent } from './anexos-list/anexos-list.component';




@NgModule({
  declarations: [
    MantenimientoComponent,
    ListBusquedaPrestamoComponent,
    ListBusquedaComponent,
    AnexosListComponent
  
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    AppCustomModule
  ]
})
export class MantenimientoModule { }
