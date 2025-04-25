import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaComercialRoutingModule } from './bandeja-comercial-routing.module';
import { BandejaComercialComponent } from './bandeja-comercial.component';
import { BandejaComponent } from 'src/app/view/crm/procesos/bandeja/bandeja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    BandejaComercialComponent,
    BandejaComponent
    
  ],
  imports: [
    CommonModule,
    BandejaComercialRoutingModule,
    AppCustomModule
  ]
})
export class BandejaComercialModule { }
