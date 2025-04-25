import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AprobacionComprasRoutingModule} from './aprobacion-compras-routing.module';
import { AprobacionComprasComponent } from './aprobacion-compras.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { DetalleComprasComponent } from './detalle-compras/detalle-compras.component';
import { AprobacionCompraPublicaComponent } from './aprobacion-compra-publica/aprobacion-compra-publica.component';
import { DenegacionCompraPublicaComponent } from './denegacion-compra-publica/denegacion-compra-publica.component';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    AprobacionComprasComponent,
    DetalleComprasComponent,
    AprobacionCompraPublicaComponent,
    DenegacionCompraPublicaComponent
  ],
  imports: [
    CommonModule,
    CalendarModule,
    AprobacionComprasRoutingModule,
    AppCustomModule
  ]
})
export class AprobacionComprasModule { }
