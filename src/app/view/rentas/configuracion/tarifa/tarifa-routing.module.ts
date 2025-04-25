import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TarifaComponent } from './tarifa.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'tarifa'
    },
    children: [
      {
        path: '',
        component: TarifaComponent,
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifaRoutingModule { }
