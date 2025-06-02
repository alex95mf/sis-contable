import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultasRoutingModule } from './multas-routing.module';
import { MultasComponent } from './multas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    MultasComponent,
    ListBusquedaComponent,
    ModalSolicitudComponent

  ],
  imports: [
    CommonModule,
    MultasRoutingModule,
    AppCustomModule,
    NgxCurrencyDirective
  ]
})
export class MultasModule { }
