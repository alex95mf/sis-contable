import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaBodegaRoutingModule } from './bandeja-bodega-routing.module';
import { BandejaBodegaComponent } from './bandeja-bodega.component';
import { BandejaComponent } from 'src/app/view/crm/procesos/bandeja/bandeja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    BandejaBodegaComponent,
    BandejaComponent
    
  ],
  imports: [
    CommonModule,
    BandejaBodegaRoutingModule,
    AppCustomModule
  ]
})
export class BandejaBodegalModule { }
