import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { GeneracionRoutingModule } from './generacion-routing.module';
import { GeneracionComponent } from './generacion.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';

@NgModule({
  declarations: [
    GeneracionComponent,
    ListLiquidacionesComponent,
    ModalContribuyentesComponent,
    ModalInspeccionesComponent,
    ModalExoneracionesComponent,
    ModalConceptosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    GeneracionRoutingModule
  ]
})
export class GeneracionModule { }
