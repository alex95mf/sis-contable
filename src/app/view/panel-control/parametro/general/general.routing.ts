import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'sistemas/parametros'
        },
        children: [
            {
                path: '',
                component: GeneralComponent,
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

export class GeneralRoutingModule { }