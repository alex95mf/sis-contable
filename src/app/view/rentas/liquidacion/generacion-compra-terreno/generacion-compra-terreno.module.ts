import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionCompraTerrenoRoutingModule } from './generacion-compra-terreno-routing.module';
import { GeneracionCompraTerrenoComponent } from './generacion-compra-terreno.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalContribuyentesComponent } from '../../pred-urbano/generacion/modal-contribuyentes/modal-contribuyentes.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalArriendosComponent } from './modal-arriendos/modal-arriendos.component';

@NgModule({
  declarations: [
    GeneracionCompraTerrenoComponent,
    ModalContribuyentesComponent,
    ModalExoneracionesComponent,
    ListLiquidacionesComponent,
    ModalArriendosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    GeneracionCompraTerrenoRoutingModule,
  ]
})
export class GeneracionCompraTerrenoModule { }
