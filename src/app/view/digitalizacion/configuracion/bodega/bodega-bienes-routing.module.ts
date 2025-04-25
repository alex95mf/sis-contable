import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodegaBienesComponent } from './bodega-bienes.component';

const routes: Routes = [
  {
    path: '',
    component: BodegaBienesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodegaRoutingModule { }
