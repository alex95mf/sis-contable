import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'rentas/tasas/'
    },
    children: [
      {
        path: 'tablas-configuracion',
        loadChildren: () => import('./tablas-config/tablas-config.module').then(m => m.TablasConfigModule)
      },
      {
        path: 'liquidacion',
        loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
      },

      {
        path: 'tasas-varias',
        loadChildren: () => import('./tasas-varias/tasas-varias.module').then(m => m.TasasVariasModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasasRoutingModule { }
