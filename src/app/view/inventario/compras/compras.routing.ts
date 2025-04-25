import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: '/inventario/compras'
        },
        children: [
            {
                path: 'solicitud',
                loadChildren: () => import('./solicitud/solicitud.module').then(m => m.SolicitudModule)
            },
            {
                path: 'ordenes',
                loadChildren: () => import('./ordenes/ordenes.module').then(m => m.OrdenesModule)
            },
            {
                path: 'registro',
                loadChildren: () => import('./factura-compra/factura-compra.module').then(m => m.FacturaCompraModule)
            },
            {
                path: 'proveedores',
                loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule)
            },
            {
                path: 'retencion',
                loadChildren: () => import('./retencion-compra/retencion-compra.module').then(m => m.RetencionCompraModule)
            },
            {
                path: 'reporte',
                loadChildren: () => import('./reports-compra/reports-compra.module').then(m => m.ReportsCompraModule)
            },
            {
                path: 'notasdebito',
                loadChildren: () => import('./nota-debito/nota-debito.module').then(m => m.NotaDebitoModule)
            },
            {
                path: 'notascredito',
                loadChildren: () => import('./nota-credito/nota-credito.module').then(m => m.NotaCreditoModule)
            },
            {
                path: 'searchProviders',
                loadChildren: () => import('./consulta-supplier/consulta-supplier.module').then(m => m.ConsultaSuppliersModule)
            }
        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasInvRoutingModule {}