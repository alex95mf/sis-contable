import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparativoComponent } from './comparativo.component';

const routes: Routes = [
  {
    path: '',
    component: ComparativoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparativoRoutingModule { }
