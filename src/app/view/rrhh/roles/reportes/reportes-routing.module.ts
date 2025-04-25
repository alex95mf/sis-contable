import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes.component';

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'reportes'
      },
      children: [
          {
              path: '',
              component: ReportesComponent,
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
export class ReportesRoutingModule { }
