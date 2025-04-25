import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguridadComponent } from './seguridad.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Seguridad'
        },
        children: [
            {
                path: '',
                component: SeguridadComponent,
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
export class SeguridadRoutingModule { }