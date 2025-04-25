import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientoRoutingModule } from './movimiento-routing.module';
import { ReformaInternaComponent } from './reforma-interna/reforma-interna.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
//import { ReporteComponent } from './reporte/reporte.component';


@NgModule({
  declarations: [
    
  
    //ReporteComponent
  ],
  imports: [
    CommonModule,
    MovimientoRoutingModule,
    AppCustomModule
  ]
})
export class MovimientoModule { }
