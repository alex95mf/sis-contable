import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioNuevoComponent } from './formulario-nuevo.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'formulario-nuevo'
    },
    children: [
        {
          path: '',
          component: FormularioNuevoComponent,
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
export class FormularioNuevoRoutingModule { }
