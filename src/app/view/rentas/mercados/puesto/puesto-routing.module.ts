import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PuestoComponent } from './puesto.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'puesto'
    },
    children: [
      {
        path: '',
        component: PuestoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuestoRoutingModule { }
