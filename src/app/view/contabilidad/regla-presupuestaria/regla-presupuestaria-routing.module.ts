import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ReglaPresupuestariaComponent } from './regla-presupuestaria.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: ReglaPresupuestariaComponent,
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReglaPresupuestariaRoutingModule { }
