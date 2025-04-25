import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteProductosComponent } from './reporte-productos.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'reporte-productos'
      },
      children: [
          {
              path: '',
              component: ReporteProductosComponent,
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
export class ReporteProductosRoutingModule { }
