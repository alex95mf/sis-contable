/* import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametroComponent } from './parametro.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'sis'
        },
        children: [
            {
                path: '',
                component: ParametroComponent,
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
export class ParametroRoutingModule { } */