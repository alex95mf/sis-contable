import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitulosComponent } from './titulos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'titulos',
    },
    children: [
      {
        path: '',
        component: TitulosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TitulosRoutingModule { }
