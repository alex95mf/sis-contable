import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaProductoComponent } from './categoria-producto.component';

const routes: Routes = [
  {
    path:'',
    component: CategoriaProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaProductoRoutingModule { }
