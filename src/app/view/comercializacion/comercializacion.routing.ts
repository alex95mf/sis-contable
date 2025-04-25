import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'comercializacion'
        },
        children: [
            {
                path: 'cliente',
                loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
            },
            {
                path: 'producto',
                loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule)
            },
            {
                path: 'facturacion',
                loadChildren: () => import('./facturacion/facturacion.module').then(m => m.FacturacionModule)
            },
            {
                path: 'vendedores',
                loadChildren: () => import('./vendedores/vendedores.module').then(m => m.VendedoresModule)
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComercializacionRoutingModule { }