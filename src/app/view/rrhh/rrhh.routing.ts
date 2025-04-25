import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'rrhh'
        },
        children: [
            {
                path: 'nomina',
                loadChildren: () => import('./adm-nomina/adm-nomina.module').then(m => m.AdmNominaModule)
            },
            {
                path: 'roles',
                loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: 'beneficios',
                loadChildren: () => import('./beneficios/beneficios.module').then(m => m.BeneficiosModule)
            },
            {
                path: 'configuracion',
                loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
            }
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RRHHRoutingModule { }