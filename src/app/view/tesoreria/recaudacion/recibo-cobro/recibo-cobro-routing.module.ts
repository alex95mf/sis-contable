import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReciboCobroComponent } from './recibo-cobro.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'recibo-cobro'
    },
    children: [
      {
        path: '',
        component: ReciboCobroComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReciboCobroRoutingModule { }
