import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion.routing'; 
import { ConfiguracionComponent } from './configuracion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    ConfiguracionComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    MatRadioModule,
    // SharedModule,  // Para los componentes propios del tema
    NgxCurrencyModule,
    ConfiguracionRoutingModule
  ]
})
export class ConfiguracionModule { }
