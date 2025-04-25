import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormHigieneComponent } from './form-higiene.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'formulario de higiene'
    },
    children: [
        {
            path: '',
            component: FormHigieneComponent,
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
export class FormHigieneRoutingModule { }
