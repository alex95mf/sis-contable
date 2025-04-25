import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormRentasComponent } from './form-rentas.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'formulario rentas'
    },
    children: [
        {
            path: '',
            component: FormRentasComponent,
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
export class FormRentasRoutingModule { }
