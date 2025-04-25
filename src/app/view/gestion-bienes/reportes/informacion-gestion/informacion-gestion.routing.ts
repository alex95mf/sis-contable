import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformacionGestionComponent } from './informacion-gestion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: InformacionGestionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionGestionRoutingModule
{ }
