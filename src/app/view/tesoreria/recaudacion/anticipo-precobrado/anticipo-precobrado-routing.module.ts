import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnticipoPrecobradoComponent } from './anticipo-precobrado.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'nota-credito'
    },
    children: [
      {
        path: '',
        component: AnticipoPrecobradoComponent,
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticipoPrecobradoRoutingModule { }
