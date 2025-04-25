import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'administracion/mesa-ayuda'
    },
    children: [
      {
          path: 'ticket',
          loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule)
      },
      {
        path: 'bandeja-trabajo',
        loadChildren: () => import('./bandeja-trabajo/bandeja-trabajo.module').then(m => m.BandejaTrabajoModule)
      },
      {
        path: 'bandeja-trabajo-general',
        loadChildren: () => import('./bandeja-trabajo-general/bandeja-trabajo-general.module').then(m => m.BandejaTrabajoGeneralModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
      },
      {
        path: 'organigrama',
        loadChildren: () => import('./organigrama/organigrama.module').then(m => m.OrganigramaModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesaAyudaRoutingModule { }
