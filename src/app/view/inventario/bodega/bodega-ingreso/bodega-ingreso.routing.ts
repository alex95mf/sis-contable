import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodegaIngresoComponent } from './bodega-ingreso.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bodega'
        },
        children: [
            {
                path: '',
                component: BodegaIngresoComponent,
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
export class BodegaIngresoRoutingModule { }