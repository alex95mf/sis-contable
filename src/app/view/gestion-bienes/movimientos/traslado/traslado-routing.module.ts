import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrasladoComponent } from './traslado.component';

const routes: Routes = [
  {
    path: '',
    component: TrasladoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrasladoRoutingModule { }
