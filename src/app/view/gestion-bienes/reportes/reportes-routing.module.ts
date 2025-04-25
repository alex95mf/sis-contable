import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
     data: {
       title: '/bienes/reportes'
     },
    children: [
      {
        path: 'kardex',
        loadChildren: () => import('./kardex/kardex.module').then(m => m.KardexModule)
      },
      {
        path: 'informes-gestion',
        loadChildren: () => import('./informacion-gestion/informacion-gestion.module').then(m => m.InformacionGestionModule)
      },
      {
        path: 'reporte-detallado-bienes',
        loadChildren: () => import('./reporte-detallado-bienes/reporte-detallado-bienes.module').then(m => m.ReporteDetalladoBienesModule)
      },
      {
        path: 'reporte-productos',
        loadChildren: () => import('./reporte-productos/reporte-productos.module').then(m => m.ReporteProductosModule)
      },
      {
        path: 'reporte-saldos',
        loadChildren: () => import('./reporte-saldos/reporte-saldos.module').then(m => m.ReporteSaldosModule)
      },
      {
        path: 'administrar-max-min',
        loadChildren: () => import('./reporte-uno/reporte-uno.module').then(m => m.ReporteUnoModule)
      },
      {
        path: 'analisis-existencia',
        loadChildren: () => import('./reporte-dos/reporte-dos.module').then(m => m.ReporteDosModule)
      },
      {
        path: 'consulta-movimientos',
        loadChildren: () => import('./consulta-movimientos/consulta-movimientos.module').then(m => m.ConsultaMovimientosModule)
      },
      {
        path: 'reclamos',
        loadChildren: () => import('./reclamos/reclamos.module').then(m => m.ReclamosModule)
      },
      {
        path: 'polizas',
        loadChildren: () => import('./vencimiento/vencimiento.module').then(m => m.VencimientoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
