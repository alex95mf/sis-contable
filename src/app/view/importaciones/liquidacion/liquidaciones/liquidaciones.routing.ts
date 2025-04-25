import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiquidacionesComponent } from './liquidaciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'liquidaciones'
        },
        children: [
            {
                path: '',
                component: LiquidacionesComponent,
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
export class LiquidacionesRoutingModule { }