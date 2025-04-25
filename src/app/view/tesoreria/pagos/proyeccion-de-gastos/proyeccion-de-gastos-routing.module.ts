import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyeccionDeGastosComponent } from './proyeccion-de-gastos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Proyeccion de Gastos'
    },
    children: [
      {
        path: '',
        component: ProyeccionDeGastosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyeccionGastosnRoutingModule
{ }
