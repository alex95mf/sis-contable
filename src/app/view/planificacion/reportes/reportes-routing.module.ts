import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoaComponent } from './poa/poa.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PacComponent } from './pac/pac.component';
import { TareasComponent } from './tareas/tareas.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'proyecto'
    },
    children: [
      {
        path: 'poa',
        component: PoaComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'pac',
        component: PacComponent
      },
      {
        path: 'tareas',
        component: TareasComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
