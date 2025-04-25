import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodegaComprasComponent } from './bodega-compras.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bodega'
        },
        children: [
            {
                path: '',
                component: BodegaComprasComponent,
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
export class BodegaComprasRoutingModule { }