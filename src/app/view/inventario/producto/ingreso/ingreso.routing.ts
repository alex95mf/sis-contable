import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoComponent } from './ingreso.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ingreso'
        },
        children: [
            {
                path: '',
                component: IngresoComponent,
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

export class IngresoRoutingModule { }