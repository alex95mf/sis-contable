import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetasComponent } from './metas.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'metas',
    },
    children: [
      {
        path: '',
        component: MetasComponent,
        data: {
          title: '',
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetasRoutingModule { }
