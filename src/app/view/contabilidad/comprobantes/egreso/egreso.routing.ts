import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EgresoComponent } from './egreso.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'egreso'
        },
        children: [
            {
                path: '',
                component: EgresoComponent,
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

export class EgresoRoutingModule { }