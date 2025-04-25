import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionGarantiaComponent } from './gestion-garantia.component';

const routes: Routes = [
  {
    path: '',
    component: GestionGarantiaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionGarantiaRoutingModule { }
