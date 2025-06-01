import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreCxcRoutingModule } from './cierre-cxc.routing';
import { CierreCxcComponent } from './cierre-cxc.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';


@NgModule({
  declarations: [
    CierreCxcComponent,
    ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    CierreCxcRoutingModule
  ]
})
export class CierreCxcModule { }
