import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalancecomprobacionComponent } from './balancecomprobacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: BalancecomprobacionComponent,
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

export class BalanceComprobacionRoutingModule { }