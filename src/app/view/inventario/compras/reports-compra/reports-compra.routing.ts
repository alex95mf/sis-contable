import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsCompraComponent } from './reports-compra.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'compra'
        },
        children: [
            {
                path: '',
                component: ReportsCompraComponent,
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
export class ReportsCompraRoutingModule { }