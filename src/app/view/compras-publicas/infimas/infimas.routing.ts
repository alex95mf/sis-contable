import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfimasComponent } from './infimas.component';

const routes: Routes = [
  {
    path: '',
    component: InfimasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfimasRoutingModule { }
