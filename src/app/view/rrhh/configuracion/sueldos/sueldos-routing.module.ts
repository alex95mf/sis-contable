import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SueldosComponent } from './sueldos.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: SueldosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SueldosRoutingModule
{ }
