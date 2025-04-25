import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'liquidacion-cem',
    loadChildren: () => import('./liquidacion-cem/liquidacion-cem.module').then(m => m.LiquidacionCemModule),
  },
  {
    path: 'liquidacion-pr',
    loadChildren: () => import('./liquidacion-pr/liquidacion-pr.module').then(m => m.LiquidacionPrModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
