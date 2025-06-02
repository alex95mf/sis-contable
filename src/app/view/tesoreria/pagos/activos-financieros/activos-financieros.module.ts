import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivosFinancierosRoutingModule } from './activos-financieros-routing.module';
import { ActivosFinancierosComponent } from './activos-financieros.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { MovimientosBancariosComponent } from './movimientos-bancarios/movimientos-bancarios.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    ActivosFinancierosComponent,
    ListRecDocumentosComponent,
    ModalInspeccionesComponent,
    ModalLiquidacionesComponent,
    MovimientosBancariosComponent
  ],
  imports: [
    CommonModule,
    ActivosFinancierosRoutingModule,
    AppCustomModule,
    NgxCurrencyDirective
  ]
})
export class ActivosFinancierosModule { }
