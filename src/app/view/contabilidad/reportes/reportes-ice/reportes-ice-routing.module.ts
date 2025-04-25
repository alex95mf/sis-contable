import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesIceComponent } from './reportes-ice.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'bandeja'
    },
    children: [
        {
          path: '',
          component: ReportesIceComponent,
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
export class ReportesIceRoutingModule { }
