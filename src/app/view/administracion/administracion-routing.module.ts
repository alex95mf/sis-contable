import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'administracion'
    },
    children: [
        {
            path: 'tramites',
            loadChildren: () => import('./tramites/tramites.module').then(m => m.TramitesModule)
        },
        {
          path: 'cp',
          loadChildren: () => import('./tramites/configuracion/configuracion.module').then(m => m.ConfiguracionModule)
        },
        {
          path: 'mesa-ayuda',
          loadChildren: () => import('./mesa-ayuda/mesa-ayuda.module').then(m => m.MesaAyudaModule)
        },
        {
          path: 'agenda-virtual',
          loadChildren: () => import('./agenda-virtual/agenda-virtual.module').then(m => m.AgendaVirtualModule)
        }
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
