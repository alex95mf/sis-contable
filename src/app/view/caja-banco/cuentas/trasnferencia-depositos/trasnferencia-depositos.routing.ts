import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrasnferenciaDepositosComponent } from './trasnferencia-depositos.component'; 

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Transferencia Depositos'
        },
        children: [
            {
                path: '',
                component: TrasnferenciaDepositosComponent,
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
export class TrasnferenciaDepositosRoutingModule { }