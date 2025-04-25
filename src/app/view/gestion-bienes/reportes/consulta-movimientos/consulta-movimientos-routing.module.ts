import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaMovimientosComponent } from './consulta-movimientos.component';

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'kardex'
      },
      children: [
          {
              path: '',
              component: ConsultaMovimientosComponent,
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
export class ConsultaMovimientosRoutingModule { }
