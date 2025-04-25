import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // data: {
    //   title: 'bienes'
    // },
    children: [
      {
        path: 'configuracion',
        loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
      },
      {
        path: 'movimientos',
        loadChildren: () => import('./movimientos/movimientos.module').then(m => m.MovimientosModule)
      },
     
      {
        path: 'reportes',
        loadChildren: ()=>import('./reportes/reportes.module').then(m=>m.ReportesModule)
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionBienesRoutingModule { }
