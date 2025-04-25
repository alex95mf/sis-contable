import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrucePagosComponent } from './cruce-pagos.component';

const routes: Routes = [
  {
    path: '',
    component: CrucePagosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrucePagosRoutingModule { }
