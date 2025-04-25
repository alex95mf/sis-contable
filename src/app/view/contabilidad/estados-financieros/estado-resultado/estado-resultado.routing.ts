import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstadoResultadoComponent } from './estado-resultado.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: EstadoResultadoComponent,
                data: {
                    title: ''
                }
            },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EstadoResultadoRoutingModule { }