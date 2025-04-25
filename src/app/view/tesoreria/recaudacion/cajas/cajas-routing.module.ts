import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajasComponent } from './cajas.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'caja'
    },
    children: [
      {
        path: '',
        component: CajasComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajasRoutingModule { }
