import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubgrupoProductoComponent } from './subgrupo-producto.component';

const routes: Routes = [
  {
    path:'',
    component: SubgrupoProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubgrupoProductoRoutingModule { }
