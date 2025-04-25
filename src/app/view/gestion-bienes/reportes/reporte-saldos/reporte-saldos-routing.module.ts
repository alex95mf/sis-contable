import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteSaldosComponent } from './reporte-saldos.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'reportes-modulos'
      },
      children: [
          {
              path: '',
              component: ReporteSaldosComponent,
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
export class ReporteSaldosRoutingModule { }
