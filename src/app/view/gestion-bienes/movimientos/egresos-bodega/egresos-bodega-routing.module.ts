import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EgresosBodegaComponent } from './egresos-bodega.component';

const routes: Routes = [
  {
    path: '',
    component: EgresosBodegaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresosBodegaRoutingModule { }