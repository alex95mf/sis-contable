import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaPagosComponent } from './consulta-pagos.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaPagosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaPagosRoutingModule { }
