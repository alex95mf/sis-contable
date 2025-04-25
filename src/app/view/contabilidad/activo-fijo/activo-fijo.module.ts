import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivoFijoComponent} from './activo-fijo.component';
import {ActivoFijoRoutingModule} from './activo-fijo.routing';
/* import { EtiquetaAcfijoComponent } from './etiqueta-acfijo/etiqueta-acfijo.component'; */
/* import { ReporteAcfijoComponent } from './reporte-acfijo/reporte-acfijo.component';
 */

@NgModule({
  declarations: [ActivoFijoComponent/* , EtiquetaAcfijoComponent */ /* ReporteAcfijoComponent */],
  imports: [
    CommonModule,
    ActivoFijoRoutingModule
  ]
})
export class ActivoFijoModule { }
