import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermisosEmitidosRoutingModule } from './permisos-emitidos-routing.module';
import { PermisosEmitidosComponent } from './permisos-emitidos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { PermisoDetComponent } from './permiso-det/permiso-det.component';


@NgModule({
  declarations: [
    PermisosEmitidosComponent,
    PermisoDetComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    PermisosEmitidosRoutingModule
  ]
})
export class PermisosEmitidosModule { }
