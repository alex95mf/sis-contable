import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'comercializacion/producto'
        },
        children: [
            {
                path: 'producto',
                loadChildren: () => import('../../inventario/producto/consulta/consulta.module').then(m => m.ConsultaProductoModule)
            },
            {
                path: 'precios',
                loadChildren: () => import('../../inventario/producto/lista/lista.module').then(m => m.ListaPrecioModule)
            },
            {
                path: 'solicitud',
                loadChildren: () => import('./solicitud/solicitud.module').then(m => m.SolicitudModule)
            },
            {
                path: 'devoluciones',
                loadChildren: () => import('./devoluciones/devoluciones.module').then(m => m.DevolucionesModule)
            }/* ,
            {
                path: 'mantenimiento',
                loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule)
            } */,
            {
                path: 'ofertas',
                loadChildren: () => import('../../inventario/producto/ofertas/ofertas.module').then(m => m.OfertasModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoComercilizacionRoutingModule {}