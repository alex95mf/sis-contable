import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'estadofinanciero'
        },
        children: [
            // {
            //     path: 'etdresultado',
            //     loadChildren: () => import('./estado-resultado/estado-resultado.module').then(m => m.EstadoResultadoModule)
            // },
            {
                path: 'etdresultado',
                loadChildren: () => import('./estado-resultado/estado-resultado.module').then(m => m.EstadoResultadoModule)
            },

            {
                path: 'balanceg',
                loadChildren: () => import('./balance-general/balance-general.module').then(m => m.BalanceGeneralModule)
            },
            {
                path: 'comparativos',
                loadChildren: () => import('./comparativo/comparativo.module').then(m => m.ComparativoModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadosFinancierosRoutingModule {}