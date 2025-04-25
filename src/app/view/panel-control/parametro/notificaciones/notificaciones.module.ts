import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule } from './notificaciones.routing';
import { NotificacionesComponent } from './notificaciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';


@NgModule({
  declarations: [
    NotificacionesComponent,
    ModalDetallesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NotificacionesRoutingModule
  ]
})
export class NotificacionesModule { }
