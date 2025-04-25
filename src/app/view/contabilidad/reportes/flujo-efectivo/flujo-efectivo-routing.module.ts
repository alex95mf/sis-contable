import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlujoEfectivoComponent } from './flujo-efectivo.component'; 

const routes: Routes = [
  {
    path: '',
    component: FlujoEfectivoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoEfectivoRoutingModule { }
