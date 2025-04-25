import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteDosComponent } from './reporte-dos.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'reporte-uno'
      },
      children: [
          {
              path: '',
              component: ReporteDosComponent,
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
export class ReporteDosRoutingModule { }
