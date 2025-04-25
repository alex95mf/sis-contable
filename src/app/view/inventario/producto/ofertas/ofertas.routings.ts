import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfertasComponent } from './ofertas.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ofertas'
        },
        children: [
            {
                path: '',
                component: OfertasComponent,
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

export class OfertasRoutingModule { }