import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostasComponent } from './costas.component';

const routes: Routes = [
  { path: '', component: CostasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostasRoutingModule { }
