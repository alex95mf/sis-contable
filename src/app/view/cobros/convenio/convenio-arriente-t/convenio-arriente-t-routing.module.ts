import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvenioArrienteTComponent } from './convenio-arriente-t.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'arriendos-terreno'
    },
    children: [
        {
          path: '',
          component: ConvenioArrienteTComponent,
          data: {
              title: ''
          }
      },
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenioArrienteTRoutingModule { }
