import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'importacion'
        },
        children: [
            {
                path: 'pedido',
                loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule)
            },
            {
                path: 'gasto',
                loadChildren: () => import('./gasto/gasto.module').then(m => m.GastoModule)
            },
            {
                path: 'liquidacion',
                loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImprtRoutingModule {}