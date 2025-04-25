import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioConceptosComponent } from './formulario-conceptos.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'formulario-conceptos'
    },
    children: [
        {
          path: '',
          component: FormularioConceptosComponent,
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
export class FormularioConceptosRoutingModule { }
