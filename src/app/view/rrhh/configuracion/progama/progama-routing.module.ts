import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgamaComponent } from './progama.component';

const routes: Routes = [
  {
    path: '',
    component: ProgamaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgamaRoutingModule { }
