import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistribuidorComponent } from './distribuidor.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'distribuidor'
        },
        children: [
            {
                path: '',
                component: DistribuidorComponent,
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
export class DistribuidorRoutingModule { }