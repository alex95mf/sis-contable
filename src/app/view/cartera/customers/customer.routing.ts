import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'cliente'
        },
        children: [
            {
                path: 'fichero',
                loadChildren: () => import('./customers-register/customers-register.module').then(m => m.CustomersRegisterModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./customers-consult/customers-consult.module').then(m => m.CustomersConsultModule)
            },
            {
                path: 'ecuenta',
                loadChildren: () => import('./consulta-estado-cliente/consulta-estado-cliente.module').then(m => m.ConsultaEstadoClientetModule)
            }   
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }