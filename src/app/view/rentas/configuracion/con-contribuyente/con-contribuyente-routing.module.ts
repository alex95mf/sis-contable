import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConContribuyenteComponent } from './con-contribuyente.component';

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'con-contribuyente'
      },
      children: [
          {
              path: '',
              component: ConContribuyenteComponent,
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
export class ConContribuyenteRoutingModule { }
