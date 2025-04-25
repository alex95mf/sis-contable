import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaTitulosComponent } from './consulta-titulos.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaTitulosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaTitulosRoutingModule { }
