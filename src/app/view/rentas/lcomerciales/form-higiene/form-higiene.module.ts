import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormHigieneRoutingModule } from './form-higiene-routing.module';
import { FormHigieneComponent } from './form-higiene.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';

import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';



@NgModule({
  declarations: [
    FormHigieneComponent,
    ModalInspeccionesComponent,
    AnexosListComponent,
    ModalInspeccionesComponent,
    ModalVistaFotosComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    FormHigieneRoutingModule
  ]
})
export class FormHigieneModule { }
