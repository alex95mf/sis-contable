import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreCajaComponent } from './cierre-caja.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'cierre de caja'
    },
    children: [
      {
        path: '',
        component: CierreCajaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreCajaRoutingModule { }
