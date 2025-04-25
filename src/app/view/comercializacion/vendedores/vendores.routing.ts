import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'comercializacion/vendedores'
        },
        children: [
            {
                path: 'vendedor',
                loadChildren: () => import('../../comercializacion/vendedores/vendedor/vendedor.module').then(m => m.VendedorModule)
            },
            {
                path: 'distribuidor',
                loadChildren: () => import('../../comercializacion/vendedores/distribuidor/distribuidor.module').then(m => m.DistribuidorModule)
            },
            {
                path: 'organizacion',
                loadChildren: () => import('../../comercializacion/vendedores/organizacion/organizacion.module').then(m => m.OrganizacionModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedoresRoutingModule {}