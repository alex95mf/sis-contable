import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarantiaComponent } from './garantia.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'garantia'
    },
    children: [
      {
        path: '',
        component: GarantiaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarantiaRoutingModule { }
