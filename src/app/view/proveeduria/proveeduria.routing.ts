import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
   {
      path: '',
      data: {
         title: 'proveeduria'
      },
      children: [
         {
            path: 'compra',
            loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule)
         },
         {
            path: 'esuministro',
            loadChildren: () => import('./egresos/egresos.module').then(m => m.EgresosModule)
         },
         {
            path: 'inventario',
            loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule)
         },
         {
            path: 'reportes',
            loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
         },
         {
            path: 'pago',
            loadChildren: () => import('./pagos-servicios/pagos-servicios.module').then(m => m.PagosServiciosModule)
         }
      ]
   },

];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ProveduriaRoutingModule { }