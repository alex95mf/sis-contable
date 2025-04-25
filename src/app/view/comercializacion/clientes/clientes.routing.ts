import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'comercializacion/cliente'
        },
        children: [
            {
                path: 'asignacion',
                loadChildren: () => import('./asignacion-cliente/asignacion-cliente.module').then(m => m.AsignacionClienteModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('../../cartera/customers/customers-consult/customers-consult.module').then(m => m.CustomersConsultModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CientesRoutingModule {}