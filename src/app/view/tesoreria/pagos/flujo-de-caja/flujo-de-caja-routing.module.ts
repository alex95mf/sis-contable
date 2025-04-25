import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlujoDeCajaComponent } from './flujo-de-caja.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Flujo De Caja'
    },
    children: [
      {
        path: '',
        component: FlujoDeCajaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCajaRoutingModule
{ }
