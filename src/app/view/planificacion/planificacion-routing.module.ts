import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'planificacion'
    },
    children: [
      {
        path: 'plan',
        loadChildren: () => import('./plan/plan.module').then(m => m.PlanModule)
      },
      {
        path: 'programa',
        loadChildren: () => import('./programa/programa.module').then(m => m.ProgramaModule)
      },
      {
        path: 'proyecto',
        loadChildren: () => import('./proyecto/proyecto.module').then(m => m.ProyectoModule)
      },
      {
        path: 'reportes',
        loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanificacionRoutingModule { }
