import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'inventario/bodega'
        },
        children: [
            {
                path: 'fichero',
                loadChildren: () => import('./bodega-ingreso/bodega-ingreso.module').then(m => m.BodegaIngresoModule)
            },
            {
                path: 'distribucion',
                loadChildren: () => import('./bodega-distribuir/bodega-distribuir.module').then(m => m.BodegaDistribuirModule)
            },
            {
                path: 'grupos',
                loadChildren: () => import('./grupos/grupos.module').then(m => m.GruposModule)
            },
        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodegaRoutingModule {}