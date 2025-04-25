import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistroComponent } from './registro/registro.component';
import { MetasOdsComponent } from './metas-ods/metas-ods.component';

const routes: Routes = [{
  path: '',
  data: {
    title: 'plan'
  },
  children: [
    {
      path: 'asignacion',
      loadChildren: () => import('./registro/registro.module').then(m => m.PlanRegistroModule)
    },
    {
      path: 'consulta',
      loadChildren: () => import('./consulta/consulta.module').then(m => m.PlanConsultaModule)
    },
    {
      path: 'metas',
      loadChildren: () => import('./metas/metas.module').then(m => m.MetasModule)
    },
    //en desuso
    {
      path: 'old-metas',
      loadChildren: () => import('./metas-ods/metas-ods.module').then(m => m.MetasOdsModule)
    },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
