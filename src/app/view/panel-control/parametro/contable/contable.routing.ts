import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContableComponent } from './contable.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contable'
        },
        children: [
            {
                path: '',
                component: ContableComponent,
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

export class contableRoutingModule { }