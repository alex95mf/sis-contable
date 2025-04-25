import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresoBodegaComponent } from './ingreso-bodega.component';

const routes: Routes = [
  {
    path: '',
    component: IngresoBodegaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoBodegaRoutingModule { }
