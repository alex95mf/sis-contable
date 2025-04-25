import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionContableRoutingModule } from './configuracion-contable-routing.module';
import { ConfiguracionContableComponent } from './configuracion-contable.component';
import { ModalModificacionesContableComponent } from './modal-modificaciones-contable/modal-modificaciones-contable.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { EncargadoTrasladoComponent } from 'src/app/view/gestion-bienes/movimientos/traslado/encargado-traslado/encargado-traslado.component';


@NgModule({
  declarations: [
    ConfiguracionContableComponent,
    ModalModificacionesContableComponent,
    ModalCuentPreComponent,
    EncargadoTrasladoComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionContableRoutingModule,
    AppCustomModule
  ]
})
export class ConfiguracionContableModule { }
