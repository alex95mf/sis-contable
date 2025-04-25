import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaCreditoComponent } from './bandejat-credito.component';

const routes: Routes = [
  {
    path: '',
    component: BandejaCreditoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaCreditoRoutingModule { }
