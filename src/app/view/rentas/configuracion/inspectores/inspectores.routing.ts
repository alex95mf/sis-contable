import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectoresComponent } from './inspectores.component';

const routes: Routes = [
  { path: '', component: InspectoresComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectoresRoutingModule { }
