import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovContableComponent } from './mov-contable.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'mov-contable'
        },
        children: [
            {
                path: '',
                component: MovContableComponent,
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

export class MovContableRoutingModule { }