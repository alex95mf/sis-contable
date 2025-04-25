import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionValorComponent } from './generacion-valor.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'generacion'
    },
    children: [
      {
        path: '',
        component: GeneracionValorComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneracionValorRoutingModule { }
