import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'producto'
    , loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule)
  },
  {
    path: 'revision'
    , loadChildren: () => import('./revision/revision.module').then(m => m.RevisionModule)
  },
  {
    path: 'cliente'
    , loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
