import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasasVariasComponent } from './tasas-varias.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Tasas varias'
    },
    children: [
        {
            path: '',
            component: TasasVariasComponent,
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
export class TasasVariasRoutingModule { }
