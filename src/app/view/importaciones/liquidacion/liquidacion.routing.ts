import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'importacion/liquidacion'
        },
        children: [
            {
                path: 'registro',
                loadChildren: () => import('./liquidaciones/liquidaciones.module').then(m => m.LiquidacionesModule)
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
export class LiquidacionImpRoutingModule { }