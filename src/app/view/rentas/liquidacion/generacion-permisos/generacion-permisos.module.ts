import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionPermisosRoutingModule } from './generacion-permisos-routing.module';
import { GeneracionPermisosComponent } from './generacion-permisos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionPermisosComponent,
    ModalExoneracionesComponent,
    ListLiquidacionesComponent,

  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    GeneracionPermisosRoutingModule,
  ]
})
export class GeneracionPermisosModule { }
