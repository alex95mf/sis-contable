import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametrosComponent } from './parametros.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'parametros'
        },
        children: [
            {
                path: '',
                component: ParametrosComponent,
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

export class ParametrosRoutingModule { }