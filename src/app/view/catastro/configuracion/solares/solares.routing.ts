import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolaresComponent } from './solares.component'; 

const routes: Routes = [
  { path: '', component: SolaresComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolaresRoutingModule { }
