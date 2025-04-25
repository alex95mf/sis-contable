import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldosEmpleadoComponent } from './saldos-empleado.component';

const routes: Routes = [
  { path: '', component: SaldosEmpleadoComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosEmpleadoRoutingModule { }
