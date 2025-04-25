import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaVendedorComponent } from './bandeja-vendedor.component';

const routes: Routes = [
  {
    path: '',
    component: BandejaVendedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaVendedorRoutingModule { }
