import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteDetalladoBienesComponent } from './reporte-detallado-bienes.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: ReporteDetalladoBienesComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteDetalladoBienesRoutingModule { }
