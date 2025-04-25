import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: '/inventario/operativo'
        },
        children: [
            {
                path: 'recepcion',
                loadChildren: () => import('./bodega-compras/bodega-compras.module').then(m => m.BodegaComprasModule)
            },
            {
                path: 'importacion',
                loadChildren: () => import('./recepcion/recepcion.module').then(m => m.RecepcionModule)
            },
            {
                path: 'despacho',
                loadChildren: () => import('./bodega-despacho/bodega-despacho.module').then(m => m.BodegaDespachoModule)
            }
        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoRoutingModule {}