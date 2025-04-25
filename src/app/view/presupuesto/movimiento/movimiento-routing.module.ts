import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'presupuesto/movimiento/'
    },
    children: [
      {
        path: 'reforma-interna',
        loadChildren: () => import('./reforma-interna/reforma-interna.module').then(m => m.ReformaInternaModule)
      },
      {
        path: 'reforma-codigo',
        loadChildren: ()=> import('./reforma-codigo/reforma-codigo.module').then(m=>m.ReformaCodigoModule)
      },
      {
        path: 'cedula-presupuestaria',
        loadChildren: ()=>import('./cedula-presupuestaria/cedula-presupuestaria.module').then(m=>m.CedulaPresupuestariaModule)
      },
      {
        path: 'consulta-movimientos',
        loadChildren: ()=>import('./consulta-movimientos/consulta-movimientos.module').then(m=>m.ConsultaMovimientosModule)
      },
      {
        path: 'consulta-idp',
        loadChildren: ()=>import('./consulta-idp/consulta-idp.module').then(m=>m.ConsultaIdpModule)
      },
      {
        path: 'reportes',
        loadChildren: ()=>import('./reporte/reporte.module').then(m=>m.ReporteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientoRoutingModule { }
