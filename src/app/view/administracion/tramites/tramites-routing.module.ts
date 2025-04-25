import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'administracion/tramites'
    },
    children: [
        {
            path: 'configuracion',
            loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
        },
        {
          path: 'bandeja-trabajo',
          loadChildren: () => import('./bandeja-trabajo/bandeja-trabajo.module').then(m => m.BandejaTrabajoModule)
      }
      ,{
          path: 'tramite',
          loadChildren: () => import('./tramite/tramite.module').then(m => m.TramiteModule)
        },
        {
          path: 'dfd',
          loadChildren: () => import('./dfd/dfd.module').then(m => m.DfdModule)
        },
        
        {
          path: 'reportes',
          loadChildren: () => import('./reportes/reportes.module').then(m=>m.ReportesModule)
        },
        {
          path: 'bandeja-general',
          loadChildren: () => import('./bandeja-general/bandeja-general.module').then(m => m.BandejaGeneralModule)
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesRoutingModule { }
