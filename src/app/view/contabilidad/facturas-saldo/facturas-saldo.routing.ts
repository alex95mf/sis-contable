import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasSaldoComponent } from './facturas-saldo.component';

const routes: Routes = [
  {
    path: '',
    component: FacturasSaldoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasSaldoRoutingModule { }
