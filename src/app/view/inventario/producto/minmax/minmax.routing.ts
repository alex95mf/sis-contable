import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinmaxComponent } from './minmax.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'minmax'
        },
        children: [
            {
                path: '',
                component: MinmaxComponent,
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

export class MinMaxRoutingModule { }