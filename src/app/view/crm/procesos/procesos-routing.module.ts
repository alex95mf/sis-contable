import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bandeja'
    , loadChildren: () => import('./bandeja/bandeja.module').then(m => m.BandejaModule)
  },
  {
    path: 'bandeja-bodega'
    , loadChildren: () => import('./bandeja-bodega/bandeja-bodega.module').then(m => m.BandejaBodegalModule)
  },
  {
    path: 'bandeja-credito'
    , loadChildren: () => import('./bandeja-credito/bandeja-credito.module').then(m => m.BandejaCreditoModule)
  }
  ,
  {
    path: 'bandeja-supervisor'
    , loadChildren: () => import('./bandeja-comercial/bandeja-comercial.module').then(m => m.BandejaComercialModule)
  }
  ,
  {
    path: 'bandeja-asesor'
    , loadChildren: () => import('./bandeja-vendedor/bandeja-vendedor.module').then(m => m.BandejaVendedorModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }
