import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { ConfiguracionModule } from './tramites/configuracion/configuracion.module';

import { DfdModule } from './tramites/dfd/dfd.module';




@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    ConfiguracionModule,DfdModule

  ]
})
export class AdministracionModule { }
