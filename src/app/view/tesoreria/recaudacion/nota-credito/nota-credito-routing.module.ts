import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaCreditoComponent } from './nota-credito.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'nota-credito'
    },
    children: [
      {
        path: '',
        component: NotaCreditoComponent,
      }
    ]
  }
];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotaCreditoRoutingModule { }
