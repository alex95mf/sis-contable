import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteEsigefComponent } from './reporte-esigef.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: ReporteEsigefComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteEsigefRoutingModule
{ }
