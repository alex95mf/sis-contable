import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SumasysaldosComponent } from './sumasysaldos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: SumasysaldosComponent,
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

export class SumasySaldosRoutingModule { }