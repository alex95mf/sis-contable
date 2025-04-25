import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspeciesFiscalesComponent } from './especies-fiscales.component';

const routes: Routes = [
  {
    path:'',
    component: EspeciesFiscalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspeciesFiscalesRoutingModule { }
