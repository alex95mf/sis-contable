import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetasOdsComponent } from './metas-ods.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'metas',
    },
    children: [
      {
        path: '',
        component: MetasOdsComponent,
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
export class MetasOdsRoutingModule { }
