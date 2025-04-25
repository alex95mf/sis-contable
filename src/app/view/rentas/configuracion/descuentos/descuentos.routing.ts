import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DescuentosComponent } from './descuentos.component';

const routes: Routes = [
  { path: '', component: DescuentosComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescuentosRoutingModule { }
