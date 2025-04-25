import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnulacionComponent } from './anulacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'anulacion'
    },
    children: [
      {
        path: '',
        component: AnulacionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnulacionRoutingModule { }
