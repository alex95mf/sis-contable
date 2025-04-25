import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmisionExpedienteComponent } from './emision-expediente.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'emision-expediente'
    },
    children: [
        {
          path: '',
          component: EmisionExpedienteComponent,
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
export class EmisionExpedienteRoutingModule { }
