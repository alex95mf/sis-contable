import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReformaCodigoRoutingModule } from './reforma-codigo-routing.module';
import { ReformaCodigoComponent } from './reforma-codigo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';
import { ModalBusquedaPartidaComponent } from './modal-busqueda-partida/modal-busqueda-partida.component';
import { ModalBusquedaReformaDocComponent } from './modal-busqueda-reforma-doc/modal-busqueda-reforma-doc.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    ReformaCodigoComponent,
    ModalCuentPreComponent,
    ModalBusquedaReformaComponent,
    ModalBusquedaPartidaComponent,
    ModalBusquedaReformaDocComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    ReformaCodigoRoutingModule,
  ]
})
export class ReformaCodigoModule { }
