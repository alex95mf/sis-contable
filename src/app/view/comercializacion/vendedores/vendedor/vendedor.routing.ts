import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendedorComponent } from './vendedor.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'vendedor'
        },
        children: [
            {
                path: '',
                component: VendedorComponent,
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
export class VendedorRoutingModule { }