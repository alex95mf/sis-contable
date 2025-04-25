import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtsComponent } from './ats.component'; 

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: AtsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtsRoutingModule
{ }
