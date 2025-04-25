import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeriasComponent } from './ferias.component';

const routes: Routes = [
  { path: '', component: FeriasComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeriasRoutingModule { }
