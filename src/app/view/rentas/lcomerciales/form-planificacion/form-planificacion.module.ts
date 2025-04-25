import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { FormPlanificacionRoutingModule } from './form-planificacion-routing.module';
import { FormPlanificacionComponent } from './form-planificacion.component'
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';


@NgModule({
  declarations: [
    FormPlanificacionComponent,
    ModalInspeccionesComponent,
    AnexosListComponent,
    ModalVistaFotosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    FormPlanificacionRoutingModule
  ]
})
export class FormPlanificacionModule { }
