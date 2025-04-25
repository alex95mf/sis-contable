import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MercadoComponent } from './mercado.component';

const routes: Routes = [
  {
    path:'',
    component: MercadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MercadoRoutingModule { }
