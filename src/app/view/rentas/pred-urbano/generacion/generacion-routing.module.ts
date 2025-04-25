import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionComponent } from './generacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'generacion'
    },
    children: [
      {
        path: '',
        component: GeneracionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneracionRoutingModule { }
