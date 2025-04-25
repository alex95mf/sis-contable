import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'importacion/pedido'
        },
        children: [
            {
                path: 'registro',
                loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule)
            },
            {
                path: 'cierre',
                loadChildren: () => import('./cierre-pedido/cierre-pedido.module').then(m => m.CierrePedidoModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./consulta-importacion/consulta-importacion.module').then(m => m.ConsultaImportacionModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoImpRoutingModule {}