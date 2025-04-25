import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuestoMercadoComponent } from './puesto-mercado.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'puesto'
    },
    children: [
      {
        path: '',
        component: PuestoMercadoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuestoMercadoRoutingModule { }
