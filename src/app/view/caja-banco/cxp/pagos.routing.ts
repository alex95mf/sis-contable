import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: '/bancos/cxp'
        },
        children: [
             {
                path: 'monitorpago',
                loadChildren: () => import('./proveedores/proveedores.module').then(m => m.ProveedoresModule)
            },
            {
                path: 'pagosanticipados',
                loadChildren: () => import('./pago-anticipado/pago-anticipado.module').then(m => m.PagoAnticipadoModule)
            },
            {
                path: 'crucecuentas',
                loadChildren: () => import('./cruce-cuentas/cruce-cuentas.module').then(m => m.CruceCuentasModule)
            },
            {
                path: 'retenciones',
                loadChildren: () => import('./retenciones/retenciones.module').then(m => m.RetencionesModule)
            },
            {
                path: 'reporte-cxp',
                loadChildren: () => import('./reporte-cxp/reporte-cxp.module').then(m => m.ReporteCxpModule)
            },
            {
                path: 'new-retencion',
                loadChildren: () => import('./create-retencion/create-retencion.module').then(m => m.CreateRetencionModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule {}