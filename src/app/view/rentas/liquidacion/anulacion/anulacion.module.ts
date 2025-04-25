import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnulacionRoutingModule } from './anulacion-routing.module';
import { AnulacionComponent } from './anulacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';


@NgModule({
  declarations: [
    AnulacionComponent,
    ListLiquidacionesComponent,
    ModalLiquidacionesComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AnulacionRoutingModule
  ]
})
export class AnulacionModule { }
