import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'plantillas'
        },
        children: [
            {
                path: 'liquidacion',
                loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlantillasRoutingModule { }