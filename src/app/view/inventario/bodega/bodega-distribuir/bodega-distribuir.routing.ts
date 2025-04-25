import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodegaDistribuirComponent } from './bodega-distribuir.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bodega'
        },
        children: [
            {
                path: '',
                component: BodegaDistribuirComponent,
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
export class BodegaDistribuirRoutingModule { }