import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaCreditoRoutingModule } from './bandeja-credito-routing.module';
import { BandejaCreditoComponent } from './bandejat-credito.component';
import { BandejaComponent } from 'src/app/view/crm/procesos/bandeja/bandeja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    BandejaCreditoComponent,
    BandejaComponent
    
  ],
  imports: [
    CommonModule,
    BandejaCreditoRoutingModule,
    AppCustomModule
  ]
})
export class BandejaCreditoModule { }
