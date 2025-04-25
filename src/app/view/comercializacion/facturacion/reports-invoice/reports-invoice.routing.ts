import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsInvoiceComponent } from './reports-invoice.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cotizaciones'
        },
        children: [
            {
                path: '',
                component: ReportsInvoiceComponent,
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
export class ReportsInvoiceRoutingModule { }