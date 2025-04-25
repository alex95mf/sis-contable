import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionComponent } from './generacion.component';

const routes: Routes =  [
  {
      path: '',
      data: {
          title: 'reglas'
      },
      children: [
          {
              path: '',
              component: GeneracionComponent,
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
export class GeneracionRoutingModule { }
