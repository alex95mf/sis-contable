import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PointSalesComponent } from './point-sales.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'punto-venta'
        },
        children: [
            {
                path: '',
                component: PointSalesComponent,
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
export class PointSalesRoutingModule { }