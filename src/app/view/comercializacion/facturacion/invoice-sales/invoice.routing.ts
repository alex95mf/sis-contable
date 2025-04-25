import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSalesComponent } from './invoice-sales.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'factura-venta'
        },
        children: [
            {
                path: '',
                component: InvoiceSalesComponent,
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
export class InvoiceInternalRoutingModule { }