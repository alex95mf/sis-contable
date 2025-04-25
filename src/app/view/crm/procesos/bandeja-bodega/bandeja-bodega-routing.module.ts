import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaBodegaComponent } from './bandeja-bodega.component';

const routes: Routes = [
  {
    path: '',
    component: BandejaBodegaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaBodegaRoutingModule { }
