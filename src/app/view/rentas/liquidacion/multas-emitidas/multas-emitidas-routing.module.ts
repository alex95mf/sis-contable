import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultasEmitidasComponent } from './multas-emitidas.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'multas-emitidas'
    },
    children: [
      {
        path: '',
        component: MultasEmitidasComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultasEmitidasRoutingModule { }
