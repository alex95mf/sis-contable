import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagoAnticipadoComponent } from './pago-anticipado.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'compra'
        },
        children: [
            {
                path: '',
                component: PagoAnticipadoComponent,
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
export class PagoAnticipadoRoutingModule { }