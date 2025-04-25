import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaAlertasComponent } from './consulta-alertas.component';

export const routes: Routes = [
  {
      path: '',
      data: {
          title: 'g-wallet'
      },
      children: [
          {
              path: '',
              component: ConsultaAlertasComponent,
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
export class ConsultaAlertasRoutingModule { }
