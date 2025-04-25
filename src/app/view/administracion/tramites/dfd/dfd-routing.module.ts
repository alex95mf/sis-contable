import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DfdComponent } from './dfd.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'tramite'
    },
    children: [
        {
          path: '',
          component: DfdComponent,
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
export class DfdRoutingModule { }
