import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvenioComponent } from './convenio.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'convenio'
    },
    children: [
      {
        path: '',
        component: ConvenioComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenioRoutingModule { }
