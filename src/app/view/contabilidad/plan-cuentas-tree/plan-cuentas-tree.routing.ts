import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanCuentasTreeComponent } from './plan-cuentas-tree.component';

const routes: Routes = [
  { path: '', component: PlanCuentasTreeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCuentasTreeRoutingModule { }
