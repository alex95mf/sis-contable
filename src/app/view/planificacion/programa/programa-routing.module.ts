import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  data: {
    title: 'programa'
  },
  children: [
    {
      path: 'asignacion',
      loadChildren: () => import('./registro/registro.module').then(m => m.ProgramaRegistroModule)
    },
    {
      path: 'consulta',
      loadChildren: () => import('./consulta/consulta.module').then(m => m.ProgramaConsultaModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramaRoutingModule { }
