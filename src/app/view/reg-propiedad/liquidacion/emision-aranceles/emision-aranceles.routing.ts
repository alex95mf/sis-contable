import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmisionArancelesComponent } from './emision-aranceles.component';

const routes: Routes = [
  {
    path: '',
    component: EmisionArancelesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmisionArancelesRoutingModule { }
