import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'consulta-cotizaciones'
    , loadChildren: () => import('./consulta-cotizaciones/consulta-cotizaciones.module').then(m => m.ConsultaCotizacionesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
