import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { FormComisariaRoutingModule } from './form-comisaria-routing.module';
import { FormComisariaComponent } from './form-comisaria.component'
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component'; // Importacion
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { ModalVehiculosComponent } from './modal-vehiculos/modal-vehiculos.component';

@NgModule({
  declarations: [
    FormComisariaComponent,
    AnexosListComponent,
    ModalInspeccionesComponent,
    ModalVistaFotosComponent,
    ModalVehiculosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    FormComisariaRoutingModule
  ]
})
export class FormComisariaModule { }
