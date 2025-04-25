import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputNumberModule} from 'primeng/inputnumber';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { GeneracionRoutingModule } from './generacion-routing.module';
import { GeneracionComponent } from './generacion.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
// import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [
    GeneracionComponent,
    ListLiquidacionesComponent,
    ModalExoneracionesComponent,
    ModalArancelesComponent,
    ModalContribuyentesComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    GeneracionRoutingModule,
    InputNumberModule,
  ]
})
export class GeneracionModule { }
