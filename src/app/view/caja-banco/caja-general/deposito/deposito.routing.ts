import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositoComponent } from './deposito.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'deposito'
        },
        children: [
            {
                path: '',
                component: DepositoComponent,
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
export class DepositoRoutingModule { }