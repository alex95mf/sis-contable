import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtrasConfiguracionesRoutingModule } from './otras-configuraciones.routing';
import { OtrasConfiguracionesComponent } from './otras-configuraciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModalConfiguracionDetallesComponent } from './modal-configuracion-detalles/modal-configuracion-detalles.component';


@NgModule({
  declarations: [
    OtrasConfiguracionesComponent,
    ModalConfiguracionDetallesComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    OtrasConfiguracionesRoutingModule,
  ]
})
export class OtrasConfiguracionesModule { }
