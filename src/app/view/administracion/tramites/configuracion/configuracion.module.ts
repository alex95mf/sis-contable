import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionComponent } from './configuracion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';
import { ModalTareasComponent } from './modal-tareas/modal-tareas.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ConfiguracionComponent,
    ModalUsuarioComponent,
    ModalTareasComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    AppCustomModule,
    NgMultiSelectDropDownModule
  ]
})
export class ConfiguracionModule { }
