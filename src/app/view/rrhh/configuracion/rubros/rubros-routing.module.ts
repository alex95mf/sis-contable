import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubrosComponent } from './rubros.component';

const routes: Routes = [
  {
    path: '',
    component: RubrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubrosRoutingModule { }
