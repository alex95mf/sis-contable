import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasComponent } from './facturas.component';

export const routes: Routes = [
  {
      path: '',
      data: {
          title: 'facturas'
      },
      children: [
          {
              path: '',
              component: FacturasComponent,
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
export class FacturasRoutingModule { }
