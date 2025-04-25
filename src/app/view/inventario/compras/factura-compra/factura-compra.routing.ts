import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturaCompraComponent } from './factura-compra.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ordenes'
        },
        children: [
            {
                path: '',
                component: FacturaCompraComponent,
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
export class FacturaCompraRoutingModule { }