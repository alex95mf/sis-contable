import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComisariaComponent } from './form-comisaria.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'form-comisaria'
    },
    children: [
      {
        path: '',
        component: FormComisariaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormComisariaRoutingModule { }
