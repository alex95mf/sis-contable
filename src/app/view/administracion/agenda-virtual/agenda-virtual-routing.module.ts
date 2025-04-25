import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'administracion/agenda-virtual'
    },
    children: [
        {
            path: 'gestion',
            loadChildren: () => import('./gestion/gestion.module').then(m => m.GestionModule)
        },        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaVirtualRoutingModule { }
