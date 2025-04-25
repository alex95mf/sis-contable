import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionContableComponent } from './configuracion-contable.component';
import { ConfiguracionContableRoutingModule } from './configuracion-contable.routing';

import { ModalModSetComponent } from './modal-mod-set/modal-mod-set.component';
import {ModalCuentPreComponent} from './modal-cuent-pre/modal-cuent-pre.component';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    ConfiguracionContableComponent,ModalModSetComponent,ModalCuentPreComponent
  ],
  imports: [
    CommonModule,AppCustomModule,ConfiguracionContableRoutingModule
  ]
})
export class ConfiguracionContableModule { }

