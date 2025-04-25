import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionExpedienteComponent } from './gestion-expediente.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'gestion-expediente'
    },
    children: [
        {
          path: '',
          component: GestionExpedienteComponent,
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
export class GestionExpedienteRoutingModule { }
