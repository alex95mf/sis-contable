import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdquisicionesComponent } from './adquisiciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'adquisiciones'
        },
        children: [
            {
                path: '',
                component: AdquisicionesComponent,
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

export class AdquisicionesRoutingModule { }