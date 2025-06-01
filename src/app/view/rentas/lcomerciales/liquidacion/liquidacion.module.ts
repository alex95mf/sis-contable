import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidacionRoutingModule } from './liquidacion.routing';
import { LiquidacionComponent } from './liquidacion.component';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalOrdenInspeccionComponent } from './modal-orden-inspeccion/modal-orden-inspeccion.component';
import { ModalValoresCobrarComponent } from './modal-valores-cobrar/modal-valores-cobrar.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalBusquedaDocumentoComponent } from './modal-busqueda-documento/modal-busqueda-documento.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    LiquidacionComponent,
    ModalContribuyentesComponent,
    ModalOrdenInspeccionComponent,
    ModalValoresCobrarComponent,
    ModalExoneracionesComponent,
    ModalBusquedaDocumentoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    LiquidacionRoutingModule
  ]
})
export class LiquidacionModule { }
