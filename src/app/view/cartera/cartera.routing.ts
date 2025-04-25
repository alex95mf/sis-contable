import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cartera'
        },
        children: [
            {
                path: 'cliente',
                loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
            },
            {
                path: 'cobranza',
                loadChildren: () => import('./cobranza/cobranza.module').then(m => m.CobranzasModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarteraRoutingModule { }