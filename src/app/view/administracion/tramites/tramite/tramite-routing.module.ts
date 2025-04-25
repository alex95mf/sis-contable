import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramiteComponent } from './tramite.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'tramite'
    },
    children: [
        {
          path: '',
          component: TramiteComponent,
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
export class TramiteRoutingModule { }
