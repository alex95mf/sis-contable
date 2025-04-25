import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TomaFisicaComponent } from './toma-fisica.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'tfisica'
        },
        children: [
            {
                path: '',
                component: TomaFisicaComponent,
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

export class TomaFisicaRoutingModule { }