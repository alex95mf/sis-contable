import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaVendedorRoutingModule } from './bandeja-vendedor-routing.module';
import { BandejaVendedorComponent } from './bandeja-vendedor.component';
import { BandejaComponent } from 'src/app/view/crm/procesos/bandeja/bandeja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    BandejaVendedorComponent,
    BandejaComponent
    
  ],
  imports: [
    CommonModule,
    BandejaVendedorRoutingModule,
    AppCustomModule
  ]
})
export class BandejaVendedorModule { }
