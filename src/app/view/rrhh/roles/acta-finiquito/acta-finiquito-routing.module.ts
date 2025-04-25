import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActaFiniquitoComponent } from './acta-finiquito.component';


const routes: Routes = [
  {
      path: '',
      data: {
          title: 'acta-finiquito'
      },
      children: [
          {
              path: '',
              component: ActaFiniquitoComponent,
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
export class ActaFiniquitoRoutingModule { }
