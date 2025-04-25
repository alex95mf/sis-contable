import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioNotificacionesRoutingModule } from './formulario-notificaciones-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormularioNotificacionesComponent } from './formulario-notificaciones.component';

import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalEdicionComponent } from './modal-edition/modal-edicion.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  providers: [
    ExcelService,
  ],
  declarations: [
    FormularioNotificacionesComponent,
    ModalEdicionComponent,
    ModalDetallesComponent
  ],
  imports: [
    CommonModule,
    FormularioNotificacionesRoutingModule,
    AppCustomModule
  ]
})
export class FormularioNotificacionesModule { }
