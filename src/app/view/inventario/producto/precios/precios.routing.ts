import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreciosComponent } from './precios.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'precio'
        },
        children: [
            {
                path: '',
                component: PreciosComponent,
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

export class PreciosRoutingModule { }