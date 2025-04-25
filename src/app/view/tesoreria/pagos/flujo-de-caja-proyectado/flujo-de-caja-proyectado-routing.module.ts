import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlujoDeCajaProyectadoComponent } from './flujo-de-caja-proyectado.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Flujo De Caja Proyectado'
    },
    children: [
      {
        path: '',
        component: FlujoDeCajaProyectadoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCajaProyectadonRoutingModule
{ }
