import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaEstadoClienteComponent } from './consulta-estado-cliente.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta-estadocuentacliente'
        },
        children: [
            {
                path: '',
                component: ConsultaEstadoClienteComponent,
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
export class ConsultaEstadoClienteRoutingModule { }