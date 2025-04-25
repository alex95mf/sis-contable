import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceGeneralComponent } from './balance-general.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: BalanceGeneralComponent,
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

export class BalanceGeneralRoutingModule { }