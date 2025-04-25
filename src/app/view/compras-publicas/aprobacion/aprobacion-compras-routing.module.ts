import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobacionComprasComponent } from './aprobacion-compras.component';

const routes: Routes = [
  {
    path: '',
    component: AprobacionComprasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionComprasRoutingModule { }
