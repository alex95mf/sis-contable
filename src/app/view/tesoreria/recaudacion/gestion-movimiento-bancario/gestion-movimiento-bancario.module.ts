import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionMovimientoBancarioRoutingModule } from './gestion-movimiento-bancario-routing.module';
import { GestionMovimientoBancarioComponent } from './gestion-movimiento-bancario.component';
import { DetallesMovimientosBancComponent } from './detalles-movimientos-banc/detalles-movimientos-banc.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  providers: [
    ExcelService
  ],
  declarations: [
    GestionMovimientoBancarioComponent,
    DetallesMovimientosBancComponent
  ],
  imports: [
    CommonModule,
    GestionMovimientoBancarioRoutingModule,
    AppCustomModule
  ]
})
export class GestionMovimientoBancarioModule { }
