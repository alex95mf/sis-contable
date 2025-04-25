import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GastosComponent } from './gastos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'gastos'
        },
        children: [
            {
                path: '',
                component: GastosComponent,
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
export class GastoRoutingModule { }