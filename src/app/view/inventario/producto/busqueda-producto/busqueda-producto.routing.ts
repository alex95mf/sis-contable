import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusquedaProductoComponent } from './busqueda-producto.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'busqueda'
        },
        children: [
            {
                path: '',
                component: BusquedaProductoComponent,
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

export class BusquedaProductoRoutingModule { }