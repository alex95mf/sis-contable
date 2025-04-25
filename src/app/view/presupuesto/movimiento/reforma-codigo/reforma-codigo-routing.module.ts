import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReformaCodigoComponent } from './reforma-codigo.component';

const routes: Routes = [
  {
    path: '',
    component: ReformaCodigoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReformaCodigoRoutingModule { }
