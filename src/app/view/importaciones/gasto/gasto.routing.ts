import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'importacion/gasto'
        },
        children: [
            {
                path: 'registro',
                loadChildren: () => import('./gastos/gastos.module').then(m => m.GastosModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastoImpRoutingModule {}