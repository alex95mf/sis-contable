import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaCotizacionesComponent } from './consulta-cotizaciones.component';

const routes: Routes = [

  {
    path: '',
    component: ConsultaCotizacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCotizacionesRoutingModule { }
