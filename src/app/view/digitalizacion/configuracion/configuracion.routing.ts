import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'parametros',
    loadChildren: () => import('./parametros/parametros.module').then(m => m.ParametrosModule)
  },
  {
    path: 'bodega',
    loadChildren: () => import('./bodega/bodega-bienes.module').then(m => m.BodegaModule)
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
