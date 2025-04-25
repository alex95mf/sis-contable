import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'productos'
        },
        children: [
            {
                path: '',
                component: ProductosComponent,
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
export class ProductosRoutingModule { }