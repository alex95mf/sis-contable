import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReformaInternaComponent } from './reforma-interna.component';

const routes: Routes = [
  {
    path: '',
    component: ReformaInternaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReformaInternaRoutingModule { }
