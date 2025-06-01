import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReformaInternaRoutingModule } from './reforma-interna-routing.module';
import { ReformaInternaComponent } from './reforma-interna.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';
import { ModalBusquedaReformaGeneralComponent } from './modal-busqueda-reforma-general/modal-busqueda-reforma-general.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    ReformaInternaComponent,
    ModalBusquedaReformaComponent,ModalBusquedaReformaGeneralComponent,
    ModalCuentPreComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ReformaInternaRoutingModule,
  ]
})
export class ReformaInternaModule { }
