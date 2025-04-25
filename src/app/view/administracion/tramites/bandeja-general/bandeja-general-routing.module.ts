import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaGeneralComponent } from './bandeja-general.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'bandeja'
    },
    children: [
        {
          path: '',
          component: BandejaGeneralComponent,
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
export class BandejaGeneralRoutingModule { }
