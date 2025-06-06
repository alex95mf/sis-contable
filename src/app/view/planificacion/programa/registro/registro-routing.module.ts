import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro.component';

const routes: Routes = [{
  path: '',
  data: {
      title: 'asignacion'
  },
  children: [
      {
          path: '',
          component: RegistroComponent,
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
export class RegistroRoutingModule { }
