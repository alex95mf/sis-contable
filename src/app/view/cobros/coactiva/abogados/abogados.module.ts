import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AbogadosComponent } from './abogados.component';
import {AbogadosRoutingModule} from './abogados.routing';
import { ModalEdicionComponent } from './modal-edicion/modal-edicion.component';
import { ModalNuevoComponent } from './modal-nuevo/modal-nuevo.component'

@NgModule({
  declarations: [
    AbogadosComponent,
    ModalEdicionComponent,
    ModalNuevoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AbogadosRoutingModule
  ]
})
export class AbogadosModule { }
