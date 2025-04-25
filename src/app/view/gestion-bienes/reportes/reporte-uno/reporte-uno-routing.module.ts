import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteUnoComponent } from './reporte-uno.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'reporte-uno'
      },
      children: [
          {
              path: '',
              component: ReporteUnoComponent,
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
export class ReporteUnoRoutingModule { }
