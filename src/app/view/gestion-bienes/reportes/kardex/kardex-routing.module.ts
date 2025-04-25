import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KardexComponent } from './kardex.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'kardex'
      },
      children: [
          {
              path: '',
              component: KardexComponent,
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
export class KardexRoutingModule { }
