import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaTrabajoGeneralComponent } from './bandeja-trabajo-general.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'bandeja-trabajo-general'
    },
    children: [
        {
          path: '',
          component: BandejaTrabajoGeneralComponent,
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
export class BandejaTrabajoGeneralRoutingModule { }
