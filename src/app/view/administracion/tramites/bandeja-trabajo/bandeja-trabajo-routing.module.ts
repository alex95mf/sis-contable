import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaTrabajoComponent } from './bandeja-trabajo.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'bandeja'
    },
    children: [
        {
          path: '',
          component: BandejaTrabajoComponent,
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
export class BandejaTrabajoRoutingModule { }
