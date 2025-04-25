import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodegaDespachoComponent } from './bodega-despacho.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'despacho'
        },
        children: [
            {
                path: '',
                component: BodegaDespachoComponent,
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
export class BodegaDespachoRoutingModule { }