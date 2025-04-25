import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisionCierreComponent } from './revision-cierre.component';

const routes: Routes = [
  {
    path:'',
    component: RevisionCierreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisionCierreRoutingModule { }
