import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioNotificacionesComponent } from './formulario-notificaciones.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'formulario-notificaciones'
    },
    children: [
        {
          path: '',
          component: FormularioNotificacionesComponent,
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
export class FormularioNotificacionesRoutingModule { }
