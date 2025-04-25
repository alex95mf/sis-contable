import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeProtestadoComponent } from './cheque-protestado.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'chequeprotestados'
        },
        children: [
            {
                path: '',
                component: ChequeProtestadoComponent,
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
export class ChequeProtestadoRoutingModule { }