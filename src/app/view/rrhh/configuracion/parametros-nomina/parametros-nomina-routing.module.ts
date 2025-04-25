import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrosNominaComponent } from './parametros-nomina.component';
const routes: Routes = [
  {
    path: '',
    component: ParametrosNominaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosNominaRoutingModule { }
