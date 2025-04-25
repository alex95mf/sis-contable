import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasasInteresComponent } from './tasas-interes.component';

const routes: Routes = [
  {
    path: '',
    component: TasasInteresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasasInteresRoutingModule { }
