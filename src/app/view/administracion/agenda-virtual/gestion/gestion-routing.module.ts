import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionComponent } from './gestion.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'gestion'
    },
    children: [
        {
          path: '',
          component: GestionComponent,
          data: {
              title: ''
          }
      },
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
