import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsientoCierreComponent } from './asiento-cierre.component';

const routes: Routes = [
  {
    path: 'emision',
    component: AsientoCierreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsientoCierreRoutingModule { }
