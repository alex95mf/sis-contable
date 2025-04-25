import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRentasRoutingModule } from './form-rentas-routing.module';
import { FormRentasComponent } from './form-rentas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { ModalActivosComponent } from './modal-activos/modal-activos.component';


@NgModule({
  declarations: [
    FormRentasComponent,
    ModalInspeccionesComponent,
    AnexosListComponent,
    ModalVistaFotosComponent,
    ModalActivosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    FormRentasRoutingModule
  ]
})
export class FormRentasModule { }
