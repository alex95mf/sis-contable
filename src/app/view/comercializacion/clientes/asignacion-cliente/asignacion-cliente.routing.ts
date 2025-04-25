import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignacionClienteComponent } from './asignacion-cliente.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ventas/asignacion'
        },
        children: [
            {
                path: '',
                component: AsignacionClienteComponent,
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

export class AsignacionClienteRoutingModule { }