import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametroadComponent } from './parametroad.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: ParametroadComponent,
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
export class ParametroadRoutingModule { }