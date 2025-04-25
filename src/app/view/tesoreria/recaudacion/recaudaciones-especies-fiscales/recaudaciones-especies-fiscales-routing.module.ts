import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecaudacionesEspeciesFiscalesComponent } from './recaudaciones-especies-fiscales.component';

const routes: Routes = [
  {
    path:'',
    component: RecaudacionesEspeciesFiscalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecaudacionesEspeciesFiscalesRoutingModule { }
