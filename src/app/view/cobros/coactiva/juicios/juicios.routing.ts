import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuiciosComponent } from './juicios.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'juicios'
    },
    children: [
      {
        path: '',
        component: JuiciosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuiciosRoutingModule { }
