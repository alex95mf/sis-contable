import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AperturaComponent } from './apertura.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'apertura'
        },
        children: [
            {
                path: '',
                component: AperturaComponent,
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
export class AperturaRoutingModule { }