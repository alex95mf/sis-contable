import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'inventario'
        },
        children: [
            {
                path: 'producto',
                loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule)
            },
            {
                path: 'bodega',
                loadChildren: () => import('./bodega/bodega.module').then(m => m.BodegaModule)
            },
            {
                path: 'operativo',
                loadChildren: () => import('./operativo/operativo.module').then(m => m.OperativoModule)
            },
            {
                path: 'compras',
                loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule)
            }

        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule {}