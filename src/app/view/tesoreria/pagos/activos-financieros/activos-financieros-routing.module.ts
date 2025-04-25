import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivosFinancierosComponent } from './activos-financieros.component';

const routes: Routes = [
  {
    path:'',
    component: ActivosFinancierosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivosFinancierosRoutingModule { }
