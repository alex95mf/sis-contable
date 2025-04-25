import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreGeneralComponent } from './cierre-general.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'cierre general'
    },
    children: [
      {
        path: '',
        component: CierreGeneralComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreGeneralRoutingModule { }
