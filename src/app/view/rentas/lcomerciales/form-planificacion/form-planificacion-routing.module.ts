import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormPlanificacionComponent } from './form-planificacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'form-planificacion'
    },
    children: [
      {
        path: '',
        component: FormPlanificacionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormPlanificacionRoutingModule { }
