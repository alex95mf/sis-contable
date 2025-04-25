import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CierrePedidoComponent } from './cierre-pedido.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cierre-pedido'
        },
        children: [
            {
                path: '',
                component: CierrePedidoComponent,
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
export class CierrePedidoRoutingModule { }