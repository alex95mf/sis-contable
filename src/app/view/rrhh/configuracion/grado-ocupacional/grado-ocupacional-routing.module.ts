import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GradoOcupacionalComponent } from './grado-ocupacional.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: GradoOcupacionalComponent,
      }
    ]
  }
];/* 
const routes: Routes = []; */

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradoOcupacionalRoutingModule { }
