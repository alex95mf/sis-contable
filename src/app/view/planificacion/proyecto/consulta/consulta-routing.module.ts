import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta.component';

const routes: Routes = [{
  path: '',
  data: {
      title: 'consulta'
  },
  children: [
      {
          path: '',
          component: ConsultaComponent,
          data: {
              title: ''
          }
      }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
